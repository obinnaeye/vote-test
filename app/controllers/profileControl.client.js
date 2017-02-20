(function () {
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + "/api/userprofile", loadProfile));
    
    var profilePix = document.getElementById("profilePix"),
        diplayName = document.getElementById("profileName"),
        profilePolls = document.getElementById("profilePolls"),
        //createPollButton = document.getElementById("createPoll"),
        deletePollID = "";
        
    function userPolls(data){
        var pollArr = JSON.parse(data),
            pollHtml = "",
            len = pollArr.length;
        
        if(len > 0){
            while (len){
                var currentPoll = pollArr[len-1],
                    currentID = currentPoll._id;
                
                pollHtml += '<li class="profile-poll" id=' + currentID +   '>' +
                            '<span>' + currentPoll.name + '</span>' + 
                            '<a href="/username/polls/' + currentID + '"><button class="profile-poll-btns profile-poll-view">View</button></a>'+
                            '<button class="profile-poll-btns profile-poll-delete">Delete</button>'+
                            '</li>';
                len--;
            }
            profilePolls.innerHTML = pollHtml;
            var viewButton = document.getElementsByClassName("profile-poll-view"),
                deleteButton = document.getElementsByClassName("profile-poll-delete");
            
            //add eventlisteners to dynamically added nodes
            var delBtnLent = deleteButton.length;
            
            while (delBtnLent) {
                var btn = deleteButton[delBtnLent-1];
                btn.addEventListener("click", deleteWarn, false);
                delBtnLent--;
            }
            
        }else{
            document.getElementById("loading").innerHTML = 'No Polls - Click "Create Polls" to create a new poll.' 
        }
    }
    
    function loadProfile(data){
        var obj = JSON.parse(data);
        profilePix.style.backgroundImage = "url(" + obj.github.profilePicture[0].value + ")";
        diplayName.innerHTML = obj.github.displayName;
        
        var username = obj.github.username;
        
        ajaxFunctions.ajaxRequest('GET', appUrl + "/api/userpolls?username=" + username, userPolls);
    }
    
    function viewPoll(){
        //view poll in the specified /:id route
    }
    
    function deleteCallback(data){
        document.getElementById("deleteWarning").style.display = "none";
        var username = JSON.parse(data).author;
        ajaxFunctions.ajaxRequest('GET', appUrl + "/api/userpolls?username=" + username, userPolls);
    }
    
    function deletePoll(){
        ajaxFunctions.ajaxRequest('DELETE', appUrl + "/api/deletepoll?pollid=" + deletePollID, deleteCallback);
    }
    document.getElementById("deleteWarnPoll").addEventListener("click", deletePoll, false);
    
    function deleteWarn(){
        deletePollID = this.parentElement.getAttribute("id");
        document.getElementById("deleteWarning").style.display = "block";
    }
    
    function cancelDelete(){
        document.getElementById("deleteWarning").style.display = "none";
    }
    document.getElementById("deleteWarnCancel").addEventListener("click", cancelDelete, false);
    
})();