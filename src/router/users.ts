import expres from 'express'
import { getAllUsers,deleteUser, updatePassword } from '../controllers/users'
import { isAuthenticated,isOwnerOrAdmin } from '../middlewares'

export default (router: expres.Router) => {
    router.get('/users',isAuthenticated,getAllUsers)
    router.delete('/users/:id',isAuthenticated,isOwnerOrAdmin,deleteUser)
    router.patch('/users/:id',isAuthenticated,isOwnerOrAdmin,updatePassword)
}