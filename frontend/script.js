const usersHolder = $("#users-holder");
$(document).ready(() => {
    $.getJSON(" https://gvc7s8rvkg.execute-api.us-east-2.amazonaws.com/dev/users", (users) => {
        users.forEach(user => {
            createTabForUser(user);        
        });
    });
})

function createTabForUser(user){
    
    usersHolder.append("p");
}