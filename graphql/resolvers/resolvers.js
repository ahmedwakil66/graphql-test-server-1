import dateResolver from '../customScalars/DateScalar.js';
import songsResolver from './songsResolver.js';
import todosResolver from './todosResolver.js';
import usersResolver from './usersResolver.js';

export default [dateResolver, usersResolver, todosResolver, songsResolver];