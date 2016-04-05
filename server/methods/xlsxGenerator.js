if(Meteor.isServer) {
	


	Meteor.methods({
		createDocument: function (data) {
			var userList = data.listed;
			if (userList) {
				

				var name = "Attendance list | " + moment().format('LL');
			
				$ = cheerio.load('<html><head><title>'+name+'</title><body></body></head></html>');
				$('body').html('<table><thead><tr><td>Name</td><td>Id</td></tr></thead><tbody></tbody></table>');
				userList = userList.forEach(function(g) {
					$('body tbody').append('<tr><td>'+g.fullName+'</td><td>'+g._id+'</td></tr>');
				});

				// userList = userList.map(function(g) {
				// 	return [g._id, g.fullName];
				// });

				// var buildr = [{id: 1, name: ("List for " + moment().format('LL')), data: userList}];
				
				// var bfr = nxlsx.build(buildr);


				return $.html();
			};
		}
	});
};