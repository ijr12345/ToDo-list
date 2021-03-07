class note {
	constructor(words, tag, eye) {
		this.words = words;
		this.tag = tag;
		this.eye = eye;
	}
}


//is used to initialize the counter for the id numbers
var idcounter = 0;

//recalls an ongoing counter for the id numbers 
chrome.storage.local.get('hello', function(result){
	//allows for a/synchronous call to be made
	if (result.hello) {
		//alert('counters is ' + result.hello);
		idcounter = result.hello;
	}
		
})

//used to keep track of how many total active notes there are 
var j = 0;

//this it to recall older notes that were once made before opening nottes up
chrome.storage.local.get(function(items){

	//will print list items
	if (Object.keys(items).length > 0 && items.data) {
		
		//remembers length of notes in the list so it can traverse/print correct notes
		j = items.data.length;

		for (var i =0; i < items.data.length; i++) {

			//created a delete button. 
			var d = document.createElement("button");
			d.textContent = 'x';
			d.setAttribute('class', 'delete_button');
			//uses note function to create new note in list
			var notes = addnote(items.data[i].words, items.data[i].tag, items.data[i].eye);
			//append button to the new note
			document.getElementById(items.data[i].eye).appendChild(d);
									
		}

	}
	//if no notes exist prior to opening extension, then nothing happens and program continues
	else {
		return;	
	}

});



//the array the notes will be stored in (in chrome.local storage)
var data =[];
//var j = 0;

//a new note is created
document.getElementById("create").onclick = function() {
	
	//creating new note from keyboard input
	var x = document.getElementById("text").value;

	//tags are left empty until i code it later. (updating)
	mynote = new note(x, "", idcounter);
	
	
	//saves new note object into storage
	chrome.storage.local.get( function (items) {

		//adds new data into already long data
		if (Object.keys(items).length > 0 && items.data) {

			items.data.push({words: mynote.words, tag: mynote.tag, eye: mynote.eye});
		}

		//creates new list and adds first item into the list 
		else {

			items.data = [{words: mynote.words, tag: mynote.tag, eye: mynote.eye}];			
		}

		//sets the immediate note into storage
		chrome.storage.local.set(items, function() {

			//prints the note into the specified space (after the other notes if needed)
			chrome.storage.local.get(function(items) {
				if (items){
				//created a delete button for specific note 
					var p = document.createElement("button");
					p.textContent = 'x';
					p.setAttribute('class', 'delete_button');

					//alert(j);

				//uses note function to create new note
					var addtolist = addnote(items.data[j].words, items.data[j].tag, items.data[j].eye);
				//append button to the new note
					document.getElementById(items.data[j].eye).appendChild(p);

				//bumps up value for the global id counter 
					idcounter++;
				//re sets counter value into chrome.storage
					chrome.storage.local.set({'hello': idcounter});

				
				//changes the counter to prepare for next note to be created
					j++; 
				}	
			})

		}) 

	})

}

//document.getElementsByClassName('delete_button').addEventListener('keypress', function() {
//	alert('hi');
//})

//document.getElementsByClassName('delete_button').addEventListener('keypress', function() {
//	alert('hi');
//})




//deletes all notes
document.getElementById("delete").onclick = function() {
	//clears chrome.storage memeory
	chrome.storage.local.clear(function() {
		//replaces html with empty space where list was
		document.getElementById("mylist").innerHTML = "";
	
		//resets variables
		j = 0;
		idcounter = 0;
	})
	
}




//allows enter to be used to create new note when typing 
document.getElementById("text").addEventListener("keypress", function(event) {
	//when enter key is pressed a new note is created
	if (event.key === 'Enter'){
		document.getElementById("create").click();

		//clears the text input area so user doesnt have to manually delete previoud note
		document.getElementById("text").value = '';
	}

})



//creates adds a note to the html
function addnote(words, tag, eye) {
	//locates area in html to place note
	var ul = document.getElementById("mylist");
	
	//creates list element and adds specific word and tag 
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(words + tag));
	
	//setting id and class attributes
	li.setAttribute("id", eye);
	
	li.setAttribute("class", 'can_delete');
	
	//adds specific list element to the parent list element
	ul.appendChild(li);

}




////THIS IS THE DELETE BUTTON. EVENT DELEGATION
document.getElementById("mylist").onclick = function (event){
	//occurs only if elements with delete button attribute are clicked
	if(event.target.className == 'delete_button') {
		
		//deletes the entire 'child' (note) that the button is attached to 
		mylist.removeChild(event.target.parentElement);
		
		//must have parentElement at the end because event target is just the button that was pressed
		var id_of_selected = event.target.parentElement.id;

		//resaves new deleted list in chrome.storage
		chrome.storage.local.get(function(items) {
			//traverse backwards to not worry about the changing size of the array
			for (var k = items.data.length - 1; k >= 0; --k) {
				//when item id matches id of selected it is spliced out of storred array 
				if (items.data[k].eye == id_of_selected) {
					//alert(items.data[k].eye);
					items.data.splice(k, 1);

					//indexes correct location in the notes array in storage. keeps track of how many 
					//total notes
					j -= 1;

					//new array is saved
					chrome.storage.local.set(items, function(){

					});

				}

			}

		})

	}
	
}




//https://stackoverflow.com/questions/27879835/adding-new-objects-to-chrome-local-storage
//asycronous api https://stackoverflow.com/questions/11688171/after-calling-chrome-tabs-query-the-results-are-not-available
//store array in chrome storage 
//https://stackoverflow.com/questions/16605706/store-an-array-with-chrome-storage-local
//https://stackoverflow.com/questions/27879835/adding-new-objects-to-chrome-local-storage


