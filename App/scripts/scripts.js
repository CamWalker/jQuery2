$('document').ready(function () {
  $('#newTaskForm').hide();

  // interface Storage {
  // readonly attribute unsigned long length;
  // getter DOMString key(in unsigned long index);
  // };

  function getData () {
    var storedItem = {};
    var $location = ""
    for (var i  = 0; i < localStorage.length; i++) {
      storedItem.task = localStorage.key(i);
      storedItem.id = localStorage.getItem(localStorage.key(i));
      // console.log(storedItem);
      listo.push(storedItem);
      if(storedItem.id === 'new') {
        $location = "#newList"
      } else if(storedItem.id === 'inProgress') {
        $location = "#currentList"
      } else if(storedItem.id === 'archived') {
        $location = "#archivedList"
      }

      // console.log(storedItem.task, storedItem.id, );
      $($location).append('<a href="#finish" class="' + storedItem.id +'" id="item">' +
        '<li class="list-group-item">' +
        '<h3>' + storedItem.task + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-arrow-right">' +
        '</span>' +
        '</li>' +
        '</a>');
    }
  }

  var listo = [];
  getData();
  // console.log(listo);

  var Task = function (task) {
    this.task = task;
    this.id = 'new';
  }

  var addTask = function(task) {
    if (task) {
      task = new Task(task);
      listo.push(task);
    }

    $('#newItemInput').val('');
    $('#newList').append(
      '<a href="#finish" class="" id="item">' +
      '<li class="list-group-item">' +
      '<h3>' + task.task + '</h3>'+
      '<span class="arrow pull-right">' +
      '<i class="glyphicon glyphicon-arrow-right">' +
      '</span>' +
      '</li>' +
      '</a>'
    );
    $('#newTaskForm').slideToggle('fast', 'linear');
  };

  var advanceTask = function(task) {
    var modified = task.innerText.trim()
    for (var i = 0; i < listo.length; i++) {

      if (listo[i].task === modified) {
        if (listo[i].id === 'new') {
          listo[i].id = 'inProgress';
        } else if (listo[i].id === 'inProgress') {
          listo[i].id = 'archived';
        } else {

          listo.splice(i, 1);
        }
        break;
      }
    }
    task.remove();
  };

  var saveStorage = function() {
    for (var i = 0; i < listo.length; i++) {
      localStorage.setItem[listo[i].task] = listo[i].id;
      console.log(listo[i].task, listo[i].id);
    }
  }




  // Interactive Parts

  $('#saveNewItem').on('click', function (e) {
    e.preventDefault();
    var task = $('#newItemInput').val().trim();
    addTask(task);
    saveStorage();
  });

  $('#add-todo').on('click', function () {
    $('#newTaskForm').fadeToggle('fast', 'linear');
  });

  $('#cancel').on('click', function(e) {
    e.preventDefault();
    $('#newTaskForm').fadeToggle('fast', 'linear');
  })

  $(document).on('click', '#item', function(e) {
  	e.preventDefault();
    var task = this;
    advanceTask(task);
    this.id = 'inProgress';
    $('#currentList').append(this.outerHTML);
    saveStorage();
  });

  $(document).on('click', '#inProgress', function (e) {
    e.preventDefault();
    var task = this;
    task.id = "archived";
    var changeIcon = task.outerHTML.replace('glyphicon-arrow-right', 'glyphicon-remove');
    advanceTask(task);
    $('#archivedList').append(changeIcon);
    saveStorage();
  });

  $(document).on('click', '#archived', function (e) {
    e.preventDefault();
    var task = this;
    advanceTask(task);
    saveStorage();
  });




  //Local Storage

  function supports_html5_storage() {
    try {
      console.log('storage is alive and well');
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      console.log("no storage");
      return false;
    }
  }
  supports_html5_storage();
});
