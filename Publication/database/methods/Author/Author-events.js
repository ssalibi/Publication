

model.Author.fullName.onGet = function() {
	return this.firstName + ' ' + this.lastName;
};
