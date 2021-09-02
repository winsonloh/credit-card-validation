$(document).ready(function() {
	var keyNum = [8,46];

	// Check card number
	$('#cardNumber').on('keyup',function(e) {
		if (keyNum.includes(e.keyCode) == false){
			let value = $(this).val();
			if (value.length > 18){
				$(this).val(value.substr(0,19));
			}
			else {
				$(this).val(function (index, value) {
					return value.replace(/[^\d]/gi, '').replace(/(.{4})/g, '$1 ');
				});
			}
		}
	});

	// Check card expiry date
	$('#expDate').on('keyup',function(e) {
		if (keyNum.includes(e.keyCode) == false){
			let value = $(this).val();
			if (value.length > 5){
				$(this).val(value.substr(0,5));
			}
			else {
				let val = dateValidate(value);
				$(this).val(val);
			}
		}
	});

	$('#creditCardSubmit').on('submit',function(event){
		$('#expError').css('display','none');
		$('#cardError').css('display','none');

		let check1 = checkCardNumber();
		if (check1 == false){
			event.preventDefault();
		}

		let check2 = checkExpiryDate();
		if (check2 == false){
			event.preventDefault();
		}
	});
});

function dateValidate(val){
	if (val.length <= 2){
		val = filterAllString(val);
		val = checkMonth(val);
		val = addSlash(val);
	}
	else {
		keepVal = val.slice(0,2);
		if (!isNaN(keepVal)){
			targetVal = val.slice(3);
			targetVal = '/'+filterAllString(targetVal);
			val = keepVal+targetVal;
		}
		else {
			val = '';
		}
	}
	return val;
}

function filterAllString(val){
	val = val.replace(/[^\d]/g, "");
	return val;
}

function checkMonth(val){
	if (val.length === 2){
		if (parseInt(val) > 12){
			val = '';
		}
	}
	else {
		if (parseInt(val) > 1){
			val = '0'+val;
		}
	}
	return val;
}

function addSlash(val){
	if (val.length === 2){
		val += '/';
	}
	return val;
}

function checkCardNumber(){
	let cardNum = $('#cardNumber').val().replace(/\s/g, '');
	let firstDigit = cardNum.slice(0,1);

	let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
	let master1 = new RegExp('^5[1-5][0-9]{14}$'); 
	let master2 = new RegExp('^2[2-7][0-9]{14}$');

	var valid = false;
	if (firstDigit == 4){
		if (visa.test(cardNum)){
			valid = true;
		}
	}
	else if (firstDigit == 5){
		if (master1.test(cardNum)){
			valid = true;
		}
	}
	else if (firstDigit == 2){
		if (master2.test(cardNum)){
			valid = true;
		}
	}

	if (valid == false){
		$('#cardError').css('display','block');
		$('#cardError').html('* Invalid credit card');
		return false;
	}
}

function checkExpiryDate(){
	let tempDate = $('#expDate').val().split('/');
	let month = tempDate[0];
	let year = tempDate[1];
	
	if (parseInt(month) > 13){
		$('#expError').css('display','block');
		$('#expError').html('* Invalid month');
		return false;
	}
	else {
		let date = new Date();
		let thisYear = String(date.getYear()).slice(-2);
		let thisMonth = date.getMonth()+1;

		// Check card expiry year
		if (parseInt(year) > parseInt(thisYear)+5){
			$('#expError').css('display','block');
			$('#expError').html('* Invalid year');
			return false;
		}
		else if (parseInt(year) < parseInt(thisYear) || (parseInt(year) == parseInt(thisYear) && parseInt(month) <= thisMonth)){
			$('#expError').css('display','block');
			$('#expError').html('* Your card is expired');
			return false;
		}
	}
}