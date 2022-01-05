const $notesTitle = $(".note-title");
const $notesText = $(".note-textarea");
const $saveNotesBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $notesList = $(".list-container .list-group");

let currentNote = {};

const getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "GET",
    });
};

const saveNotes = (note) => {
    return $.ajax({
        url: "api/notes",
        data: note,
        method: "POST",
    });
};

const deleteNotes = (id) => {
    return $.ajax({
        url: "api/notes" + id,
        method: "DELETE",
    });
};

const displayActiveNotes = () => {
    $saveNotesBtn.hide();
  
    if (currentNote.id) {
      $notesTitle.attr("readonly", true);
      $notesText.attr("readonly", true);
      $notesTitle.val(currentNote.title);
      $notesText.val(currentNote.text);
    } else {
      $notesTitle.attr("readonly", false);
      $notesText.attr("readonly", false);
      $notesTitle.val("");
      $notesText.val("");
    }
};

const createNoteId = () => {
    const characterList = "abcdefghijklmnopqrstuvwxyz";
    const charArray = characterList.split("");
    const numberList = "1234567890";
    const numbArray = numberList.split("");
    let idHolder = [];
    for (let i = 0; i < 2; i++) {
      let characterSelect = charArray[Math.floor(Math.random() * charArray.length)];
      idHolder.push(characterSelect);
    }
    for (let i = 0; i < 2; i++) {
      let numberSelect = numbArray[Math.floor(Math.random() * numbArray.length)];
      idHolder.push(numberSelect);
    }
    let newId = idHolder.join("");
    return newId;
}

const handleNotesSaved = function () {
    const newNote = {
      title: $notesTitle.val(),
      text: $notesText.val(),
      id: handleNoteId()
    };
    saveNotes(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
};

const handleNotesDeleted = function (event) {
    event.stopPropagation();
  
const note = $(this).parent(".list-group-item").data();
  
    if (currentNote.id === note.id) {
      currentNote = {};
    }
    deleteNotes(note.id).then(() => {
      getAndRenderNotes();
      displayActiveNotes();
    });
};
  
const handleNotesViewed = function () {
    currentNote = $(this).data();
    displayActiveNotes();
};
  
const handleNewNotesViewed = function () {
    currentNote = {};
    displayActiveNotes();
};

const handleRenderSaveBtn = function () {
    if (!$notesTitle.val().trim() || !$notesText.val().trim()) {
      $saveNotesBtn.hide();
    } else {
      $saveNotesBtn.show();
    }
};

const displayNotesList = (notes) => {
    $notesList.empty();
  
const noteListItems = [];

const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
};

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

const getAndRenderNotes = () => {
    return getNotes().then(renderNoteList);
};

$saveNotesBtn.on("click", handleNotesSaved);
$notesList.on("click", ".list-group-item", handleNotesViewed);
$newNoteBtn.on("click", handleNewNotesViewed);
$notesList.on("click", ".delete-note", handleNotesDeleted);
$notesTitle.on("keyup", handleRenderSaveBtn);
$notesText.on("keyup", handleRenderSaveBtn);

getAndRenderNotes();