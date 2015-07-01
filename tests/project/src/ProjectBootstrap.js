
'import com.pedro.UserHandler'

/*
 * This is the main file of your app, and it should start your app or depend upon
 * a class that does it. The dependencies declared are only instantiated in the first time
 * you use it.
 * 
 * The App class with be instantiated, and it will start a express service.
 */
function ProjectBootstrap (UserHandler) {

    console.log(UserHandler.getByID(1234567890));
}

module.exports = ProjectBootstrap;