<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/* body div{
	border: 1px solid black;
} */

#home_main_container{
	height: 100vh;
	background: url("./assets/background.jpg");
	color: white;
}

.create_form{
	padding-left: 10vw;
}

.create_form input, .create_form button{
	display: block;
}
.create_form input:not(:first-child), .create_form button{
	margin-top: 1vh;
}

#home_main_container > .warning{
	position: absolute;
	display: inline-block;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 21vh;
	text-align: center;
	color: red;
	
	width: 200px;
	height: 4.5em;
	/* background-color: red; */
}
.logged{
	background: url("./assets/logged-background.jpg");
	min-height: 99vh;
}

.header {
	background-color: rgba(0, 0, 0, 0.3);
	font-family: Unispace, Times, serif;
	display: flex;
	justify-content: center;
	align-items: center;
	text-transform: uppercase;
	font-size: 3em;
	font-weight: bold;
	text-shadow: 5px 5px 5px rgb(63, 63, 63);
	height: 15vh;
	margin-bottom: 10vh;
	/* background-color: rgb(255, 240, 192); */
}

.footer{
	height: 10vh;
}

.login_container_container{
	display: flex;
	justify-content: center;
	align-items: center;

	height: 50vh;
	
}
.login_button_container{
	display: flex;
	justify-content: center;

}

.sidebar{
	color: #0645AD;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 10px;
	/* border: 1px solid black; */
}

.sidebar span:hover{
	text-decoration: underline;
}
.edit_div{
	border-radius: 10px;
	background-color: rgb(236, 236, 236);
	padding: 2vh 2vw;
	position: fixed;
	left: 50%;
    transform: translateX(-50%);
	top: 10vh;

}
.loggedUser{
	background-color: rgb(255, 121, 121);
}
</style>
<script>
export default {
	
}
</script>

