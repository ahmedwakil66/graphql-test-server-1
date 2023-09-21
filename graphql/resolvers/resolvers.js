import dateResolver from '../customScalars/dateScalar.js';
import songsResolver from './songsResolver.js';
import todosResolver from './todosResolver.js';
import usersResolver from './usersResolver.js';
import postsResolver from './postsResolver.js'

export default [dateResolver, usersResolver, todosResolver, songsResolver, postsResolver];