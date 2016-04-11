GCLife.UserModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			username : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				},
				username : true
			},
			
			// 닉네임 중복 불가
			nickname : {
				notEmpty : true,
				size : {
					min : 2,
					max : 20
				}
			},
			
			email : {
				notEmpty : true,
				size : {
					min : 5,
					max : 320
				},
				email : true
			},
			
			password : {
				notEmpty : true,
				size : {
					min : 4,
					max : 20
				}
			},
			
			loginCount : {
				notEmpty : true,
				integer : true
			},
			
			lastLoginTime : {
				date : true
			},

			isBanned : {
				bool : true
			},

			isLeft : {
				bool : true
			},

			isAgreedTerms : {
				notEmpty : true,
				equal : true
			},

			isAgreedPrivacy : {
				notEmpty : true,
				equal : true
			},
			
			roles : {
				array : true
			}
		};

		return {
			name : 'User',
			initData : {
				loginCount : 0
			},
			methodConfig : {
				create : {
					valid : VALID(validDataSet)
				},
				update : {
					valid : VALID(validDataSet),
					authKey : 'id',
					role : GCLife.ROLE.USER
				},
				remove : false
			},
			loginValid : VALID({
				username : validDataSet.username,
				password : validDataSet.password
			})
		};
	}
});
