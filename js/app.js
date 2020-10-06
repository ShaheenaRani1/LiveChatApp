

/////////////////////////////////////////////////////////////////// Global Variable ///////////////////////////////////////////////////////////////
var currentUserKey = '';
var chatKey = '';

var currentUser = '';

var start = new Date();
var hours = start.getHours;
var mins = start.getMinutes;
document.getElementById('txtName').focus();


function showChatList() {
    document.getElementById('friendList').classList.remove('d-none', 'd-md-block')
    document.getElementById('startDiv').setAttribute('style', 'display:none')
}
var lst = '';
// Show FriendList
function getFriendList() {
    if (sign = true) {

        var db = firebase.database().ref('users');
        db.on('value', function (users) {
            users.forEach(function (data) {

                var user = data.val();
                if (user.email !== firebase.auth().currentUser.email) {

                    lst += `
                            <li  class="list-group-item list-group-item-action " key="${data.key}" >          
                            <div class="row">
                            <div class="col-2 col-sm-2 col-md-2">
                            <img class="friend-pic rounded-circle " src="${user.photoURL}" alt="">
                            </div>
                            <div class="col-10 col-sm-10 col-md-10 d-none d-md-block text-dark ">
                            <div class="name" style="margin-top:12px;">  ${user.name}</div>
                            </div>
                            </div>
                            </li>
                            `;
                }
            });
            document.getElementById('showFriendList').innerHTML = lst;
        });
    }
}
//populateFriendList

// Modal List 
function showList() {
    var lst = '';
    var db = firebase.database().ref('users');
    db.on('value', function (users) {
        users.forEach(function (data) {
            var user = data.val();
            lst += `
            <li  class="list-group-item list-group-item-action" data-dismiss="modal" style="background:lightgreen" > 
            <div class="row" onclick="startChat(1)">
                <div class="col-2 col-sm-2 col-md-2">
                    <img class="friend-pic rounded-circle " src="${user.photoURL}" alt="" style="background:lightgreen" >
                </div>
                <div class="col-10 col-sm-10 col-md-10 text-dark " style="background:lightgreen" >
                    <div class="name"> ${user.name}</div>
                   
                </div>
            </div>
        </li>
        `;
        });
        document.getElementById('lstFriend').innerHTML = lst;
    });
}

function startChat(self) {
    fKey = self.getAttribute("key");
    fName = self.getAttribute("name");
    fPhoto = self.getAttribute("photo");
    var friendList = { friendId: fKey, userId: currentUserKey };

    flag = true;
    var db = firebase.database().ref('friend_list');
    db.on('value', function (friends) {
        friends.forEach(function (data) {
            var user = data.val();
            if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || (user.friendId === friendList.userId && user.userId === friendList.friendId))// && friendList.friendId === user.friendId) // ||   user.friendId=== friendList.friendId && user.userId === friendList.userId)
            {
                flag = false;
                chatKey = data.key;
            }
        });
        if (flag === true) {
            chatKey = firebase.database().ref('friend_list').push(friendList, function (error) {

            }).getKey();
        }
    });


    document.getElementById('chatPannel').removeAttribute('style');
    document.getElementById('startDiv').setAttribute('style', 'display:none');
    document.getElementById('txtName').focus();

    document.getElementById('chatPhoto').src = fPhoto;
    document.getElementById('chatName').innerText = fName;

}
sendMessage();

function sendMessage() {

    var txtName = document.getElementById('txtName');
    txtName.addEventListener('keydown', function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {

            var chatMessage = {
             userId:currentUserKey,   
             message: document.getElementById('txtName').value,
             dataTime: new Date().toLocaleString(), 
             photoURL: firebase.auth().currentUser.photoURL, 
             name: firebase.auth().currentUser.displayName };


             firebase.database().ref('friend-chat').push(chatMessage, function (error) {
                if (error) {
                    console.error();
                } else {

                }
            });
         
        }
    });
}

sign = false;
firebase.database().ref('friend-chat').on("child_added", function (user) {
    var innerchat = '';
    if (user.val().userId !== currentUserKey) {
        innerchat=` <div class="row receive"> 
                    <div class="col-2 col-sm-2 col-md-2">
                        <img src="${user.val().photoURL}" class="profile-pic">
                    </div>
                    
                    <div class="col-8 col-sm-8 col-md-4 message ">
                    <p class="">${user.val().message}</p>
                    <span class="time float-right">${user.val().dataTime}</span>    
                    </div>  
                    </div>`
    } else {
        innerchat = `<div class="row send justify-content-end"> 
                    <div class="col-8 col-sm-8 col-md-4 message ">
                    <p class="">${user.val().message}</p>
                    <span class="time float-left"> ${user.val().dataTime}</span>    
                    </div>  
    
                    <div class="col-2 col-sm-2 col-md-2 ">
                        <img src="${user.val().photoURL}" class="profile-pic">
                    </div>                    
                    </div>`
      
    }

    document.getElementById("messages-list").innerHTML += innerchat;
    document.getElementById('txtName').value = ""
    document.getElementById('txtName').focus();
    document.getElementById('messages-list').scrollTo(0, document.getElementById('messages-list').clientHeight);

    // alert(document.getElementById("del-" + snapshot.key).value)
});

firebase.database().ref('friend-chat').on("child_removed", function (snapshot) {
    document.getElementById("del-" + snapshot.key).innerHTML = "message deleted";
});

function deleteBtn(self) {
    var id = self.getAttribute("data");
    //let deleteRef= firebase.database().ref("Students/"+id);
    //deleteRef.remove();
    firebase.database().ref('friend-chat').child(id).remove();
}



function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function () {
        sign = true;
        var html = '';
       
        document.getElementById('current-User').innerText = firebase.auth().currentUser.displayName;
        // if (sign === true) {
        //         var db = firebase.database().ref('friend-chat');
        //         db.on('value', function (friend) {
        //         friend.forEach(function (data) {
        //             if(check===true){
        //                 var user = data.val();

        //             html =  `
        //             <div class="row send"> 
        //             <div class="col-2 col-sm-2 col-md-2">
        //                 <img src="${user.photoURL}" class="profile-pic">
        //             </div>

        //             <div class="col-8 col-sm-8 col-md-4 message ">
        //                 <p class="">${user.message}</p>
        //                 <span class="time float-right"> ${user.dataTime}</span>    
        //             </div>  
        //         </div>
        //     `;
        //             document.getElementById('messages-list').innerHTML += html;
        //             }
        //         });
        //         check= false;
        //     });
        // }
    });
}
function showList() {
    if (sign === true) {
        var db = firebase.database().ref('friend-list');
        db.on('value', function (friend) {
            friend.forEach(function (data) {
                var user = data.val();
                //  alert("signin")
                // break;
            });
        });
    }
}
function signOut() {
    firebase.auth().signOut().then(function () {
        document.getElementById('showAlert').innerHTML = "<h1 class='text-primary'> Sign Out Successfully </h1>";
        document.getElementById('showAlert').setAttribute('style', 'display:block');
        document.getElementById('profile-pic').src = "images/picLogo.png"

        document.getElementById('lnkSignIn').setAttribute('style', 'display: block');
        document.getElementById('lnkSignOut').setAttribute('style', 'display: none');

        document.getElementById('showFriendList').innerHTML = '';
        document.getElementById('currentUser').innerText = 'Current User';
        lst = '';
        document.getElementById('messages-list').innerHTML = '';

    }).catch(function (error) {

    });
}
function onFirebaseStateChanged() {
    firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user) {
    if (user) {
        document.getElementById('current-User').innerText = firebase.auth().currentUser.displayName;
       
        var flag = false;
        getFriendList()
        var userProfile = { email: '', name: '', photoURL: '' }
        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photoURL = firebase.auth().currentUser.photoURL;

        var db = firebase.database().ref('users');
        db.on('value', function (users) {
            users.forEach(function (data) {
                var user = data.val();
                if (user.email === userProfile.email) {
                    flag = true;
                    currentUserKey = data.key;
                

                    document.getElementById('lnkSignIn').setAttribute('style', 'display: none');
                    document.getElementById('lnkSignOut').setAttribute('style', 'display: block');

                }
            });
            if (flag === false) {
                firebase.database().ref('users').push(userProfile, callback);
            }
        });
        // alert(firebase.auth().currentUser.email+'/n'+firebase.auth().currentUser.displayName)
        document.getElementById('profile-pic').src = firebase.auth().currentUser.photoURL;
        document.getElementById('profile-pic').title = firebase.auth().currentUser.displayName;
    }
}

function callback(error) {
    if (error) {
        console.log(error)
    } else {
        document.getElementById('profile-pic').src = firebase.auth().currentUser.photoURL;
        document.getElementById('profile-pic').title = firebase.auth().currentUser.displayName;
        // alert();

        document.getElementById('lnkSignIn').setAttribute('style', 'display: none');
        document.getElementById('lnkSignOut').setAttribute('style', 'display: block');


    }
}
onFirebaseStateChanged();
