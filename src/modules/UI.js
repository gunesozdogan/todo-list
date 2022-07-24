import { Task } from '../todo';
import { compareAsc, isThisISOWeek, format } from 'date-fns';
import { Project } from '../todo';

const UI = (function UI() {
    const allProjects = [Project('Inbox', [])];

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
            ['type', 'valueAsDate'],
            ['date', new Date()]
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
        const parentNodeName = this.closest('form').parentNode;
        const title = document.querySelector('.task-inputbox').value;
        const date = document.querySelector('.date-picker').value;
        const newTask = Task(title, date, parentNodeName);

        let index;
        if (parentNodeName.className.includes('project')) {
            index = parentNodeName.className.split(' ')[0].split('-')[2];
        } else {
            index = 0;
        }

        // PUSHING TASK TO RELATED PROJECT OBJECT'S TASKS ARRAY
        allProjects[index].tasks.push(newTask);
        removeTaskPopUp();
        displayTasks(parentNodeName);
        return newTask;
    }

    function cancelCreatingTask() {
        const parent = this.closest('form').parentNode;
        removeTaskPopUp();
        displayTasks(parent);
    }

    function getTaskIndex(element) {
        const taskIndex = element.className.split(' ')[0].split('-')[3];
        let projectIndex;

        if (element.closest('.content-project')) {
            projectIndex = element
                .closest('.content-project')
                .className.split(' ')[0]
                .split('-')[2];
        } else {
            projectIndex = 0;
        }
        return [projectIndex, taskIndex];
    }

    function deleteTask() {
        const [projectIndex, taskIndex] = getTaskIndex(this);
        const curProject = allProjects[projectIndex];
        curProject.removeTask(taskIndex);
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
    function displayTasks(parent) {
        const content = parent;
        removeAllChildNodes(content);

        let index;

        if (parent.className.includes('project')) {
            index = parent.className.split(' ')[0].split('-')[2];
        } else {
            index = 0;
        }
        const curTask = allProjects[index].tasks;

        curTask.sort((a, b) =>
            compareAsc(new Date(a.dueDate), new Date(b.dueDate))
        );

        for (let i = 0; i < curTask.length; i++) {
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
                [`${curTask[i].title}`]
            );
            const date = createElement(
                'p',
                ['task-date'],
                ['textContent'],
                [`${curTask[i].dueDate}`]
            );

            leftSide.append(btn, title);
            container.append(leftSide, date);
            content.appendChild(container);
        }
        createAddTaskButton(content);
    }

    return {
        removeAllChildNodes,
        createAddTaskButton,
        createElement,
        allProjects,
        displayTasks,
    };
})();

export default UI;
