if (Meteor.isClient) {



	var tempRet;
	Template.index2.events({
		'click #joinSessionBtn': function (e) {
			var classCode = $('#codeInput').val();
			var regCheck = /^[a-z0-9]+$/i;
			if(typeof classCode !== 'string' || classCode.length !== 6){
				Session.set('toJoinSession', '');
				if(tempRet) {tempRet = undefined;return false;};
				$('#errorMSG-ONE')[0].innerHTML = "Session ID must be 6 characters long.", $("#errorMSG-ONE").css({ opacity: 1 }), setTimeout(function () {$("#errorMSG-ONE").css({ opacity: 0 })}, 1800);
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			else if (!regCheck.test(classCode)) {
				Session.set('toJoinSession', '');
				if(tempRet) {tempRet = undefined;return false;};
				$('#errorMSG-ONE')[0].innerHTML = "Invalid session ID.", $("#errorMSG-ONE").css({ opacity: 1 }), setTimeout(function () {$("#errorMSG-ONE").css({ opacity: 0 })}, 1800);
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			else
				Session.set('toJoinSession', classCode);

		},
		'click #joinPublicViewBtn': function (e) {
			var classCode = $('#codeInput').val();
			var regCheck = /^[a-z0-9]+$/i;
			if(typeof classCode !== 'string' || classCode.length !== 6){
				if(tempRet) {tempRet = undefined;return false;};
				$('#errorMSG-ONE')[0].innerHTML = "Session ID must be 6 characters long.", $("#errorMSG-ONE").css({ opacity: 1 }), setTimeout(function () {$("#errorMSG-ONE").css({ opacity: 0 })}, 1800);
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			else if (!regCheck.test(classCode)) {
				if(tempRet) {tempRet = undefined;return false;};
				$('#errorMSG-ONE')[0].innerHTML = "Invalid session ID.", $("#errorMSG-ONE").css({ opacity: 1 }), setTimeout(function () {$("#errorMSG-ONE").css({ opacity: 0 })}, 1800);
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			else
				Router.go("/d/" + classCode + "/p");

		},
		'click #createSessionBtn': function() {	
			
			Session.set('toCreateSession', true);	
				
		},		
		'keyup input.inputPasswordTs': function(e) {
			var $this = $(e.currentTarget);
			if($this.val().length >= 1) {
		      var input_flds = $this.closest('form').find(':input.inputPasswordTs');
		      input_flds.eq(input_flds.index(e.currentTarget) + 1).select();
		    }
		},
		'focus input.inputPasswordTs': function(e) {
			$(e.currentTarget).select();
		},
		'change #geoLocSecure': function(e) {
			if (e.target.checked) {
				var $thiss = e.target;
				navigator.geolocation.getCurrentPosition(function(d, e) {
					if (e) {
						alert('There was an issue getting your location.');
						$thiss.checked = false;
						Session.set('useGeo', false);
					}
					else{
						var longitude = d.coords.longitude;
						var latitude = d.coords.latitude;
						Session.set('useGeo', {longi: longitude, lati: latitude});
					};
				});
			}
			else{
				Session.set('useGeo', false);
			};
		},
		'submit #toJoinForm': function(e) {
			e.preventDefault();
			
			var classCode = Session.get('toJoinSession');
			var fname = $('#firstNameInput').val();
			var lname = $('#lastNameInput').val();
			var stdntId = $('#studentId').val();
			var regCheckName = /^\d+$/;
			if(regCheckName.test(fname) || regCheckName.test(lname) || fname.length < 1 || lname.length < 1)
				return $('#errorMSG-joinForm')[0].innerHTML = "Please enter a valid name.", $("#errorMSG-joinForm").css('opacity', 1);
			else if (stdntId.length < 2)
				return $('#errorMSG-joinForm')[0].innerHTML = "Please enter a valid student ID.", $("#errorMSG-joinForm").css('opacity', 1);


			function getLocationAndCreateSession(datter) {
				navigator.geolocation.getCurrentPosition(function(d, e) {
					if (e) {
						if(confirm('There was an issue getting your location. Try again?')) getLocationAndCreateSession(datter)
							else removeLoaderOverlay();
					}
					else{
						var longitude = d.coords.longitude;
						var latitude = d.coords.latitude;
						if (typeof latitude === "number" && typeof longitude === "number") {
							Meteor.call("addUser", {
								fullName: fname + " " + lname,
								studentId: stdntId,
								sessionToAddToId: classCode,
								pinr: datter,
								locData: {
									lati: latitude,
									longi: longitude
								}
							}, function(err, data) {
								removeLoaderOverlay();
								if(err){
									$('input[name="pinpw"]').each(function() {
										$(this).val('');
									});
									$('input[name="pinpw"]').focus();
									return alert(err.error);
								}
								else {
									ga("send", "event", "Sessions", "Joined", 'null', new Date().getTime());
									updateSess(data, 'userId');
									updateSess(classCode, 'sessionId');
									Router.go("/d/" + classCode);
								};
							});
						}
						else{
							if(confirm("Error getting location - try again?"))
								getLocationAndCreateSession(datter);
							else removeLoaderOverlay();
						};
					};
				});
			};

			function tempEndCall(datter) {
				showLoaderOverlay(false, 420);

				Meteor.call('sessionHasGeoSecurity', classCode, function (ee, rss) {
					if (ee) {
						removeLoaderOverlay();
						return alert("Error finding session");
					}
					else if(rss){
						alert("Session is Location-secured. Allow sharing of your location.");
						getLocationAndCreateSession(datter);
					}
					else{
						Meteor.call("addUser", {
							fullName: fname + " " + lname,
							studentId: stdntId,
							sessionToAddToId: classCode,
							pinr: datter
						}, function(err, data) {
							removeLoaderOverlay();
							if(err){
								$('input[name="pinpw"]').each(function() {
									$(this).val('');
								});
								$('input[name="pinpw"]').focus();
								return alert(err.error);
							}
							else {
								ga("send", "event", "Sessions", "Joined", 'null', new Date().getTime());
								updateSess(data, 'userId');
								updateSess(classCode, 'sessionId');
								Router.go("/d/" + classCode);
							};
						});
					};
				});
			};

			Meteor.call('sesHasPin', classCode, function (e, rs) {
				if (e) {
					return alert('Error finding session');
				}
				else{
					if(rs) {
						$('#joinSession, .modal-backdrop').hide();
						$('body').before('<div id="pinDiv"><center><form id="pinForm"><h3 id="pinTitle">Session is pin protected. Enter four-digit pin # to continue</h3><input type="password" name="pinpw"  maxlength="1" /><input type="password" name="pinpw"  maxlength="1" /><input type="password" name="pinpw" maxlength="1" /><input type="password" name="pinpw"  maxlength="1" /><br><br><button class="btn btn-default pw_submit_btn_indx">&#8594;</button></form></center></div>');
						$('input[name="pinpw"]').keyup(function() {
							if($(this).val().length >= 1) {
						      var input_flds = $(this).closest('form').find(':input[name="pinpw"]');
						      input_flds.eq(input_flds.index(this) + 1).select();
						    }
						});
						$('input[name="pinpw"]').click(function() {
							$(this).select();
						});
						$('#pinForm').on('submit', function(e) {
							e.preventDefault();
							var pinstr = "";
							$('input[name="pinpw"]').each(function() {
								pinstr += $(this).val();
							});
							tempEndCall(pinstr);
						});
					}
					else tempEndCall(undefined);
				};
			});

			
		},
		'submit #createSessionForm': function(e) {
			e.preventDefault();
			var fname = $('#firstNameInput2').val();
			var lname = $('#lastNameInput2').val();
			var className = $('#classNameInput2').val();
			var range = document.getElementById('rangeinput').value;
			var pin = "";
			$('.inputPasswordTs').each(function() {
				pin += $(this).val();
			});


			var regCheck = /^\d+$/;
			if(regCheck.test(fname) || regCheck.test(lname) || fname.length < 2 || lname.length < 2)
				return $('#errorMSG-createSession')[0].innerHTML = "Please enter a valid name.", $("#errorMSG-createSession").css('opacity', 1);
			else if (className.length < 2)
				return $('#errorMSG-createSession')[0].innerHTML = "Class name must be longer than two characters.", $("#errorMSG-createSession").css('opacity', 1);
			else if(pin.length) {
				if(!regCheck.test(pin) && pin.length != 4)
				return $('#errorMSG-createSession')[0].innerHTML = "Pin can only be 4 digits.", $("#errorMSG-createSession").css('opacity', 1);
			}

			showLoaderOverlay(false, 420);
			Meteor.call("addUser", {
				fullName: fname + " " + lname,
				studentId: "SessionOwner",
			}, function(err, data) {
				if(err) {
					removeLoaderOverlay();
					return alert(err.error);
				}
				else {
					var longi, lati;
					if (Session.get('useGeo')) {
						longi = Session.get('useGeo').longi;
						lati = Session.get('useGeo').lati;
						if (typeof longi !== "number" || typeof lati !== "number") {
							alert('Could not get location information properly. Please uncheck location security to continue.');
							removeLoaderOverlay();
							return;
						};
					};
					Meteor.call('createSession', {sessionOwnerId: data, sessionName: className, pin: !pin.length? undefined: pin, studentId: "SessionOwner", latitude: lati, longitude: longi, ranger: range},
						function(err, d2) {
							removeLoaderOverlay();
							if(err)
								return alert(err.error);
							else{
								ga("send", "event", "Sessions", "Created", 'hasPin='+(!!pin.length), new Date().getTime());
								updateSess(data, 'userId');
								updateSess(d2, 'sessionId');
								Router.go("/d/" + d2);
							};
					});
				}
			});

		}
	});

	Template.index2.rendered = function() {
		$('#joinSessionBtn').trigger('click');
		$('#errorMSG-ONE')[0].innerHTML = ".";
		Session.set('tempRet', true);
		$('[data-toggle="tooltip"]').tooltip();
	};
	Template.index2.destroyed = function() {
		$('.modal-backdrop').hide();
		$('#pinDiv').fadeOut(300);
	};
	Template.index2.helpers({
		toJoinSession: function() {
			return Session.get('toJoinSession');
		},
		toCreateSession: function() {
			return Session.get('toCreateSession');
		},
		geoLocSupported: function() {
			return navigator.geolocation;
		},
		currentYear: function () {
			return 1900 + new Date().getYear();
		}
	});
};