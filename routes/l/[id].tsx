/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { tw } from "@twind";
import { ListItemTorrent } from '../../components/TorrentListItem.tsx';

export const handler = {
    async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const listAPI = new URL(`/l/${id}`, caterpillarSettings.apiURL);

    // List object
    let req = await fetch(listAPI.href);
    res.list = await req.json();
    for(let i = 0; i < res.list.orderedItems.length; i++){
	    let fetched = await fetch(res.list.orderedItems[i]);
	    fetched = await fetched.json();
            res.list.orderedItems[i] = fetched;

	fetched = await fetch(`${res.list.orderedItems[i].id}/likes`)
	res.list.orderedItems[i].likes = await fetched.json();
	fetched = await fetch(`${res.list.orderedItems[i].id}/dislikes`)
	res.list.orderedItems[i].dislikes = await fetched.json();

	fetched = await fetch(res.list.orderedItems[i].attributedTo);

	res.list.orderedItems[i].actor = await fetched.json();
    }

	// Actor data
	req = await fetch(res.list.attributedTo);
    res.user = await req.json();

    // Likes
    req = await fetch(`${listAPI.href}/likes`);
    res.likes = await req.json();

    // Dislikes
    req = await fetch(`${listAPI.href}/dislikes`);
    res.dislikes = await req.json();

    // Replies
    req = await fetch(res.list.replies);
    
    res.replies = req;
    return ctx.render(res);
  }
}

export default function Greet(props: PageProps) {
  const list = props.data.list;
  const submitter = props.data.user;
  
  return (
      <div>
	  <div class={tw`p-4 mx-auto max-w-screen-lg`}>
              <div class={tw`text-5xl font-bold leading-tight text-center`}>
		  <h1>{list.name}</h1>
              </div>
	      <div
		  id="description"
		  class={tw`m-4 p-6 shadow-lg rounded-full`}
		  dangerouslySetInnerHTML={{ __html: list.summary }}
              />
              <div class={tw`text-3xl font-bold leading-tight text-center`}>
		  <h2>Items</h2>
              </div>
	      <div>
		  {list.orderedItems.map(x => {
		      console.log(x);
		      if (x.type !== "Note") {

		      }
		      return (
			  <ListItemTorrent
			      href={(new URL(x.id)).pathname}
			      name={x.name}
			      uploader={x.actor.name}
			      icon={x.actor.icon[0]}
			      date={list.published}
			      likes={x.likes.orderedItems.length}
			      dislikes={x.dislikes.orderedItems.length}
			      magnet={x.attachment.href}
			  />
			      )
		  })}
	      </div>
	  </div>
	  <pre>{JSON.stringify(list, null, "  ")}</pre>
      </div>
		  );
}
