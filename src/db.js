const users = [{
    id: '1',
    name: 'Ronnie',
    email: 'ronnie@example.com',
    age: 37,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

const posts = [{
    id: '1',
    title: 'Merry go round',
    body: 'round and round it went',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Freeing the General',
    body: 'Sharper than the edge of a knife',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'The catch',
    body: 'It had to happen one way or another',
    published: false,
    author: '2'
  },
];

const comments = [{
    id: '1',
    text: 'Lovely',
    author: '3',
    post: '1',
  },
  {
    id: '2',
    text: 'Great read',
    author: '1',
    post: '3',
  },
  {
    id: '3',
    text: 'It was a little off',
    author: '2',
    post: '2',
  },
  {
    id: '4',
    text: 'Amazing writing',
    author: '1',
    post: '1',
  },
];

const db = {
  users, 
  posts,
  comments
}

export { db as default }
