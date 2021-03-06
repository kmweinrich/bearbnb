var Userdata = new Meteor.Collection("userData");

FlowRouter.route('/register', {
    action: function(params) {
        BlazeLayout.render("mainLayout", {content: "register"});
    }
});

FlowRouter.route('/profile/:id', {
    subscriptions: function() {
        //this.register('soundcloud', Meteor.subscribe('soundcloud'));
        //this.register('feedbackAvg', Meteor.subscribe('feedbackAvg'));
    },
    action: function(params) {
        FlowRouter.subsReady(function() {
            var user = Meteor.users.findOne({_id: params.id});
            BlazeLayout.render("mainLayout", {
                content: "profile",
                params: params,
                user: user
            });
        });
    }
});

FlowRouter.route('/editProfile/:id', {
    subscriptions: function() {
       this.register('userData', Meteor.subscribe('userData'));
     },

        action: function (params) {
              FlowRouter.subsReady(function() {
                var user = Userdata.findOne({_id: params.id});
                  user = user || {};
                var editId = Meteor.userId();

                 BlazeLayout.render("mainLayout", {
                     content: "editprofileTemp",
                     params: params,
                     editId: editId,
                     user: user
                 });
            });
         }
 });

if (Meteor.isServer) {
    Meteor.publish("userData", function () {
        return Meteor.users.find({});
    });


    Meteor.methods({
        register: function(email, password) {
            Accounts.createUser({
                "email": email,
                "password": password
            });
        },

        "editProfile": function(id, profileObj) {

              Meteor.users.update(id, {$set:
                {
                    //employer: id,
                    firstname: profileObj.firstname,
                    lastname: profileObj.lastname,
                    description: profileObj.description,
                    //gender: profileObj.gender,
                    phonenumber: profileObj.phonenumber,
                }
            });

            return id;
        }

    });
}

if (Meteor.isClient) {

    Template.registerHelper("displayName", function(user) {
        try {
          if (typeof user == "string") {
            user = Meteor.users.findOne({_id: user});
          }
        } catch (e) {}

        if (!user) {
            return "N/A";
        }

        try {
            // if (user.services && user.services.facebook) {
            //     if (user.services.facebook.name) {
            //         return user.services.facebook.name;
            //     }
            // }

            if (user.firstname && user.lastname) {
                return user.firstname + " " + user.lastname;
            } else if (!user.firstname && user.lastname) {
                return user.lastname;
            } else if (user.firstname && !user.lastname) {
                return user.firstname;
            }

            return censorEmail(user.emails[0].address) || user._id;
        } catch(e) {
            return "ERROR";
        }
    });


    Meteor.subscribe("userData");
    Template.register.events({

        "submit .registerForm": function(e) {
            e.preventDefault();
            // console.log("you are checking: " + e.target.checked.value);

            const firstName = e.target.firstName.value.trim(),
                  lastName = e.target.lastName.value.trim(),
                  password = e.target.password.value,
                  //confirmPassword = e.target.confirmPassword.value,
                  email = e.target.email.value.toLowerCase().trim(),
                  description = e.target.description.value,
                  phonenumber = e.target.phonenumber.value;


              // user object
              const user = {
                  email: email,
                  password: password,
                  profile: {
                      firstName: firstName,
                      lastName: lastName,
                      description: description,
                      phonenumber: phonenumber
                  }
              };


             if (e.target.checkbox.checked === true ) {
                Meteor.call("register", e.target.email.value, e.target.password.value, function() {
                    Accounts.createUser(user);

                    Meteor.loginWithPassword(e.target.email.value, e.target.password.value);
                    FlowRouter.go("/");
                });
            }
            else
            {
                var term = confirm("You can not register without agreeing with our terms of service!");
                FlowRouter.go("/register");
            }
        }
    });

   // get input values from editprofile template and display it to profile page
     Template.editprofileTemp.events({

        "submit .editprofileTemp": function(event) {
             event.preventDefault();

            //var gender = event.target.gender.value
            //console.log("gender" + gender);

             //editId is userID
              Meteor.call("editProfile",this.editId(), {

                 firstname: firstname.value,
                 lastname: lastname.value,
                 description: description.value,
                 //gender: gender,
                 phonenumber: phonenumber.value,

             }, function (err, id) {
                 if (id) {
                     FlowRouter.go("/profile/" + id);
                 } else {
                     console.log("you are getting error " );
                     console.log(err);
                 }
             });
         }


     });

    // Template.loginBox.events({
    //     "submit .loginBox": function(e) {
    //         e.preventDefault();
    //
    //         Meteor.loginWithPassword(e.target.email.value, e.target.password.value, function(err){
    //             if(err) {
    //                 var invalid = confirm("Invalid email and/or password!");
    //             }
    //         });
    //     }
    // });


    Template.profile.helpers({
        description: function() {
            if (this.user().profile) {
                return this.user().profile.description || "";
            }
        },

        isCurrentUser: function() {
            // if (this.user()._id === Meteor.userId()) {
            //     return true;
            // }
            return true;
        },

        stars: function() {
            var avg = FeedbackAvg.findOne({_id: this.user()._id});
            var feedbackAvg = 0;
            if (avg) {
                feedbackAvg = avg.avg;
            }
            return (new Array(parseInt(feedbackAvg)+1)).join().split('');
        }
    });

}
