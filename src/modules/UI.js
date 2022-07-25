import { getTasks, Task } from '../todo';
import { compareAsc, isThisISOWeek, format } from 'date-fns';
import { Project } from '../todo';
import { allProjects } from '../todo';

const UI = (function UI() {
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
        const [projectIndex, taskIndex] = getTaskIndex(this);

        // PUSHING TASK TO RELATED PROJECT OBJECT'S TASKS ARRAY
        allProjects[projectIndex].tasks.push(newTask);
        removeTaskPopUp();
        displayTasks(parentNodeName);
        createAddTaskButton(parentNodeName);
        return newTask;
    }

    function cancelCreatingTask() {
        const parent = this.closest('form').parentNode;
        removeTaskPopUp();
        displayTasks(parent);
        createAddTaskButton(parent);
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

    function removeTask() {
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

    // DISPLAYS TASKS FOR TODAY AND THIS WEEK PAGES
    function displayTasksTodayThisWeek(period, parent) {
        const content = parent;
        const time1 = new Date().setDate(0, 0, 0, 0);
        let time2;
        if (period === 'thisWeek') {
            time2 = new Date();
            time2.setDate(time2.getDate() + 7);
            time2.setHours(23, 59, 59, 999);
        } else {
            time2 = new Date().setHours(23, 59, 59, 999);
        }

        const arr = Object.entries(getTasks(time1, time2));

        for (let projectInd = 0; projectInd < arr.length; projectInd++) {
            if (arr[projectInd][1].length === 0) {
                continue;
            }
            const div = createElement('div');
            const h3 = createElement(
                ...['h3', , ['textContent'], [`${arr[projectInd][0]}`]]
            );

            const curArr = arr[projectInd][1];
            displayTasks(div, curArr);
            content.append(h3, div);
        }
    }

    // RENDERS ALL TASKS ON INBOX AND PROJECTS PAGES
    function displayTasks(parent, arr) {
        const content = parent;
        removeAllChildNodes(content);

        let curTask;
        if (arr) {
            curTask = arr;
        } else {
            const [projectIndex, taskIndex] = getTaskIndex(parent);
            curTask = allProjects[projectIndex].tasks;
        }

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
                removeTask
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
    }

    return {
        removeAllChildNodes,
        createAddTaskButton,
        createElement,
        displayTasks,
        displayTasksTodayThisWeek,
    };
})();

export default UI;
