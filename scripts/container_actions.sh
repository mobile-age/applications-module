#!/bin/bash

. scripts/config.sh

deploy_container () {

#	This function is used for the containers creation.	
#	Arguments:
#		$1: The name of the container
#		$2: The port to publish
#       $3: The name of the docker image

	if [ $# -ne 3 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker run -d -t --name $1 --publish $2:$2 $3
        
		return $?
	fi

}

start_container () {

#	This function is used for starting a container.	
#	Arguments:
#		$1: The container id

	if [ $# -ne 1 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker start $1

		return $?
	fi

}

stop_container () {

#	This function is used for stopping a container.	
#	Arguments:
#		$1: The container id

	if [ $# -ne 1 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker stop $1

		return $?
	fi

}

check_if_active () {

#	This function is used checking whether a container is active or not.	
#	Arguments:
#		$1: The container id

    if [ $# -ne 1 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker inspect --format='{{ .State.Running }}' $1

		return $?
	fi

}

create_workspace () {

#	This function is used for creating the workspace directory into an existing and running container.	
#	Arguments:
#		$1: The container id
#       $2: The developer username

	if [ $# -ne 2 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker exec -d $1 mkdir /home/$2

		return $?
	fi

}

sync () {

#	This function is used for creating the workspace directory into an existing and running container.	
#	Arguments:
#		$1: The container id
#       $2: The user
#       $3: The http url to local repository

	if [ $# -ne 3 ]; then

		return 1

	else
 		echo $sudoer_password |	sudo --prompt='' -S docker exec -d $1 /bin/bash -c "cd /home/$2 && git clone $3"

		return $?
	fi

}