const uuid = require('uuid')



const createUser = ({login = "", socketId = null} = {})=>(
	{
		id:uuid(),
		login,
		socketId
	}
)


const createGame = ({message = "", sender = ""} = { })=>(
		{
			id:uuid(),
			time:getTime(new Date(Date.now())),
			message,
			sender
		}
	)






