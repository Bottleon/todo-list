window.onload = function () {
  const INPUT_TEXT = document.getElementById("input-text"),
    BUTTON = document.getElementById("btn"),
    LIST_MENU = document.getElementById("list-menu"),
    SUCCESS_BTN = document.getElementById("successBtn"),
    COMPLETE_LIST_MENU = document.getElementById("complete-list-menu"),
    DELETE_ALL_BTN = document.getElementById("deleteAllBtn");

  const STORAGE = window.localStorage;
  const STORAGE_KEY = "todo_items";
  const STORAGE_COMPLETE_KEY = "todo_complete_items";
  INPUT_TEXT.addEventListener("keypress", handleAddItemEvent);
  BUTTON.addEventListener("click", callAddItem);
  DELETE_ALL_BTN.addEventListener("click", clearStorageAll);
  SUCCESS_BTN.addEventListener("click", handleSuccessClick);

  let todo_arr = [];
  let todo_complete_arr = [];

  let identify_list_num = 0;
  let identify_complete_list_num = 0;

  if (STORAGE.getItem(STORAGE_KEY) !== null) {
    loadStorage();
  }

  function callAddItem() {
    addItem(INPUT_TEXT.value, false);
    INPUT_TEXT.value = "";
    INPUT_TEXT.focus();
  }

  function handleAddItemEvent(e) {
    if (e.key === "Enter") {
      callAddItem();
    }
  }

  function addItem(value, complete) {
    if (value === "") {
      Swal.fire("추가할 내용이 없습니다.");
      return;
    }

    const item = document.createElement("li");
    const itemBox = document.createElement("span");
    const itemBox2 = document.createElement("button");

    itemBox.innerHTML = value;
    itemBox.classList.add("align-text-bottom");
    itemBox2.innerHTML = "✖️";

    itemBox2.classList.add("pointer");
    itemBox2.classList.add("btn");
    itemBox2.classList.add("btn-outline-secondary");
    itemBox2.classList.add("p-1");
    itemBox2.addEventListener("click", removeItem);

    item.appendChild(itemBox);
    item.appendChild(itemBox2);

    item.classList.add("border_bottom");
    item.classList.add("d-flex");
    item.classList.add("justify-content-between");
    item.classList.add("my-3");

    const obj = {
      item: value,
    };
    if (complete) {
      if (todo_complete_arr[todo_complete_arr.length - 1] !== undefined) {
        identify_complete_list_num =
          todo_complete_arr[todo_complete_arr.length - 1].id + 1;
      }
      item.value = identify_complete_list_num;
      obj.id = identify_complete_list_num;
      todo_complete_arr.push(obj);
      COMPLETE_LIST_MENU.appendChild(item);
      saveStorageComplete();
    } else {
      item.classList.add("pointer");
      item.addEventListener("click", handleItemClick);
      if (todo_arr[todo_arr.length - 1] !== undefined) {
        identify_list_num = todo_arr[todo_arr.length - 1].id + 1;
      }
      item.value = identify_list_num;
      obj.id = identify_list_num;
      todo_arr.push(obj);
      LIST_MENU.appendChild(item);
      saveStorage();
    }
  }

  function removeItem() {
    const removeItem = this.parentNode;
    const removeItemValue = removeItem.value;
    const removeItemParent = removeItem.parentNode;
    removeItemParent.removeChild(removeItem);
    if (removeItemParent.id === "list-menu") {
      const new_todo = todo_arr.filter(function (ele) {
        return ele.id !== removeItemValue;
      });
      todo_arr = new_todo;
      saveStorage();
    } else {
      const new_todo = todo_complete_arr.filter(function (ele) {
        return ele.id !== removeItemValue;
      });
      todo_complete_arr = new_todo;
      saveStorageComplete();
    }
  }

  function loadStorage() {
    const todo = JSON.parse(STORAGE.getItem(STORAGE_KEY));
    const todo_complete = JSON.parse(STORAGE.getItem(STORAGE_COMPLETE_KEY));
    todo.forEach((element) => {
      addItem(element.item, false);
    });
    if (todo_complete !== null) {
      todo_complete.forEach((element) => {
        addItem(element.item, true);
      });
    }
  }

  function clearStorageAll() {
    Swal.fire({
      title: "전체 삭제",
      text: "리스트를 모두 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "yes",
    }).then((result) => {
      if (result.isConfirmed) {
        STORAGE.clear();
        while (LIST_MENU.hasChildNodes()) {
          LIST_MENU.removeChild(LIST_MENU.firstChild);
        }
        while (COMPLETE_LIST_MENU.hasChildNodes()) {
          COMPLETE_LIST_MENU.removeChild(COMPLETE_LIST_MENU.firstChild);
        }
        todo_arr = [];
        todo_complete_arr = [];
        identify_list_num = 0;
        identify_complete_list_num = 0;
        Swal.fire("Deleted!", "삭제가 완료되었습니다.", "success");
      }
    });
  }

  function handleItemClick() {
    this.classList.toggle("on");
  }

  function handleSuccessClick() {
    const list = LIST_MENU.children;
    let removeItems = [];
    todo_arr = [];
    let clickTrue = false;
    for (let i = 0; i < list.length; i++) {
      const arr = list[i].className.split(" ");
      const value = list[i].firstChild.innerHTML;
      if (arr[arr.length - 1] === "on") {
        removeItems.push(list[i]);
        addItem(value, true);
        clickTrue = true;
      } else {
        todo_arr.push({
          item: value,
          id: list[i].value,
        });
      }
    }
    if (clickTrue) {
      removeItems.forEach((element) => {
        element.parentNode.removeChild(element);
      });
      saveStorage();
      location.reload();
    } else {
      Swal.fire("완료한 일들이 없습니다.<br> 완료하였으면 클릭해주세요");
    }
  }
  function saveStorage() {
    STORAGE.setItem(STORAGE_KEY, JSON.stringify(todo_arr));
  }

  function saveStorageComplete() {
    STORAGE.setItem(STORAGE_COMPLETE_KEY, JSON.stringify(todo_complete_arr));
  }
};
