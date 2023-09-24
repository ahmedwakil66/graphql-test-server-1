import dateResolver from '../customScalars/dateScalar.js';
import songsResolver from './songsResolver.js';
import todosResolver from './todosResolver.js';
import usersResolver from './usersResolver.js';
import postQueryResolvers from './postsQueryResolver.js';
import postMutationResolvers from './PostsMutationResolver.js';

export default [dateResolver, usersResolver, todosResolver, songsResolver, postQueryResolvers, postMutationResolvers];