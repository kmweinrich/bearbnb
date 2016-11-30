FlowRouter.route('/',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'test'});
    }
});

// FlowRouter.route('/houses/id',{
//     //this will be a specific house info page, what young is making
// });
FlowRouter.route('/myHouses/newHouse',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'createhouseform'});
    }
});
FlowRouter.route('/myReservations',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'myReservations'});
    }
});

FlowRouter.route('/myHouses',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'myHouses'});
    }
});

FlowRouter.route('/listHouses',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'listHouses'});
    }
});

FlowRouter.route('/cardHouse',{
    action: function(){
        BlazeLayout.render('mainLayout',{content:'listHouses'});
    }
});

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('mainLayout', {content: 'notFound'});
    }
};
