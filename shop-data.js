// SHOP: one line per painting, newest first.
//
//   id       picture number. The site uses full-ID.jpg and thumb-ID.jpg.
//            For a new painting you can instead set image: "my-photo.jpg" (one file is enough).
//   title    short description shown under the picture
//   type     e.g. "Framed", "Scroll", "Unframed", "Fan"     (optional)
//   size     e.g. "16 x 20 in"                             (optional)
//   price    a number like 40. Use null until you decide.
//   buyUrl   the Square payment link for this painting, e.g. "https://square.link/u/abc123"
//   status   "available" or "sold"
//   added    date it went up, like "2026-10-18". The newest date gets the "New this week" tag.
//
// Weekly restock: copy a line, paste it at the TOP of the list, change the details.
// When something sells: change "available" to "sold" (and turn off its link in Square).
//
// Example of a new painting with its own photo file:
//  { id: "w1-01", image: "w1-01.jpg", title: "Plum blossoms", type: "Framed", size: "", price: 40, buyUrl: "https://square.link/u/xxxx", status: "available", added: "2026-10-18" },

window.SHOP = [
  { id: "2362", title: "Two cranes in reeds before a golden moon", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2331", title: "Rooster, hen and chicks among yellow blossoms", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2338", title: "Steep green gorge with mist and a small boat", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2330", title: "Panda among bamboo", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2342", title: "Two red-crowned cranes standing among reeds", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2349", title: "Two herons among lotus flowers", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2335", title: "Golden gourds on a vine with a small blue bird", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2333", title: "Kingfisher over lotus flowers and dark rocks", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2360", title: "Lotus leaf and seed pod in ink", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2354", title: "Bird on a rock beneath teal bamboo leaves", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2341", title: "Ducks beneath large lotus leaves and a red lotus", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2347", title: "Two squirrels in a pine tree", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2358", title: "Pine-covered mountains with a waterfall", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2361", title: "Egrets in reeds under a full moon", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2339", title: "Purple grapes with a bird perched on a branch", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2344", title: "Three cranes among reeds", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2332", title: "Two squirrels on a pine branch", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2366", title: "Yellow autumn trees above turquoise water", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2352", title: "Sparrows among banana leaves", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2348", title: "Ducks swimming among bamboo and leaves", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2340", title: "Mandarin duck swimming near pink lotus flowers", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2355", title: "Mountain river landscape with a village", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2363", title: "Two birds in a glowing nest inside a hollow tree", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2336", title: "Grapes and a bird on a vine, with a monkey below", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2345", title: "Two birds on a blossoming branch", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2350", title: "River landscape with a bridge and mountains", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2351", title: "Bird on a large rock with bamboo", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2343", title: "Green mountain valley with a small house", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2346", title: "Autumn chrysanthemums and rock", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2353", title: "Snow-covered trees along a mountain stream", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2334", title: "Misty lake with small islands and trees", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2337", title: "Snowy mountain village in a valley", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
  { id: "2367", title: "Black swan and white swan with lotus flowers", type: "", size: "", price: null, buyUrl: "", status: "available", added: "" },
];
