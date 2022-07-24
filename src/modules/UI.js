import Task from '../todo';
import { compareAsc } from 'date-fns';

const UI = (function UI() {
    const allTasks = [];

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function createElement(
        nodeName,
        className,
        property,
        propertyValue,
        event
    ) {
        const element = document.createElement(nodeName);
        if (className) {
            for (let i = 0; i < className.length; i++) {
                if (className[i]) {
                    element.classList.add(className[i]);
                }
            }
        }
        if (property) {
            for (let i = 0; i < property.length; i++) {
                if (property[i]) {
                    element[property[i]] = propertyValue[i];
                }
            }
        }
        if (event) {
            element.addEventListener('click', event);
        }
        return element;
    }

    // DISPLAYS TASK INPUT POP UP
    function displayTaskPopUp() {
        const parent = this.parentNode;
        const form = createElement('form', ['task-input-form']);
        const inputBox = createElement(
            'input',
            ['task-inputbox'],
            ['placeholder'],
            ['Task Name']
        );
        const datePicker = createElement(
            'input',
            ['date-picker'],
            ['type'],
            ['date']
        );
        const inputContainer = createElement('div', ['input-container']);
        const btns = createElement('div', ['btn-container']);
        const addBtn = createElement(
            'button',
            ['add-btn'],
            ['textContent', 'type'],
            ['Add', 'button'],
            createTask
        );
        const cancelBtn = createElement(
            'button',
            ['cancel-btn'],
            ['textContent', 'type'],
            ['Cancel', 'button'],
            cancelCreatingTask
        );
        this.remove();

        inputContainer.append(inputBox, datePicker);
        btns.append(addBtn, cancelBtn);
        form.append(inputContainer, btns);
        parent.appendChild(form);
    }

    function createTask() {
        const title = document.querySelector('.task-inputbox').value;
        const date = document.querySelector('.date-picker').value;
        const newTask = Task(title, date);
        allTasks.push(newTask);

        removeTaskPopUp();
        displayTasks();
        return newTask;
    }

    function cancelCreatingTask() {
        removeTaskPopUp();
        displayTasks();
    }

    function deleteTask() {
        const index = Number(this.className[0].split('-')[3]);
        allTasks.splice(index);
        this.parentNode.parentNode.remove();
    }

    // CREATES BUTTON FOR ADDING TASK
    function createAddTaskButton(parent) {
        const btn = createElement(
            'button',
            ['add-task-btn'],
            ['innerHTML'],
            ['➕ &nbsp; &nbsp; Add Task'],
            displayTaskPopUp
        );
        parent.appendChild(btn);
    }

    function removeTaskPopUp() {
        const form = document.querySelector('.task-input-form');
        if (form) {
            form.remove();
        }
    }

    // RENDERS ALL TASKS
    function displayTasks() {
        const inboxContent = document.querySelector('.content-inbox');
        removeAllChildNodes(inboxContent);

        allTasks.sort((a, b) =>
            compareAsc(new Date(a.dueDate), new Date(b.dueDate))
        );

        for (let i = 0; i < allTasks.length; i++) {
            const container = createElement('div', ['task-container']);
            const leftSide = createElement('div', ['container-left']);
            const btn = createElement(
                'button',
                [`task-delete-btn-${i}`, 'task-delete-btn'],
                [],
                [],
                deleteTask
            );
            const title = createElement(
                'p',
                ['task-title'],
                ['textContent'],
                [`${allTasks[i].title}`]
            );
            const date = createElement(
                'p',
                ['task-date'],
                ['textContent'],
                [`${allTasks[i].dueDate}`]
            );

            leftSide.append(btn, title);
            container.append(leftSide, date);
            inboxContent.appendChild(container);
        }
        createAddTaskButton(inboxContent);
    }

    return {
        removeAllChildNodes,
        createAddTaskButton,
        createElement,
        allTasks,
    };
})();

export default UI;
