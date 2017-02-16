(function () {
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + "/api/userprofile", loadProfile));
    
    var profilePix = document.getElementById("profilePix"),
        diplayName = document.getElementById("profileName"),
        pollName = document.getElementById("profilePollName"),
        viewButton = document.getElementById("profilePollView"),
        deleteButton = document.getElementById("profilePollDelete");
    
    function loadProfile(data){
        var obj = JSON.parse(data);
        profilePix.style.backgroundImage = "url(" + obj.github.profilePicture[0].value + ")";
        diplayName.innerHTML = obj.github.displayName;
    }
    
    
    
    
    
    
})();