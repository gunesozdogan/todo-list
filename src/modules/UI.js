import { getTasks, Task, allProjects } from '../index';
import { compareAsc, format } from 'date-fns';

const UI = (function UI() {
    const storage = localStorage.getItem('allProjects');

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
        const [projectIndex, taskIndex] = getTaskIndex(this);
        const newTask = Task(title, date, allProjects[projectIndex]);

        // PUSHING TASK TO RELATED PROJECT OBJECT'S TASKS ARRAY
        allProjects[projectIndex].tasks.push(newTask);
        removeTaskPopUp();
        displayTasks(parentNodeName);
        createAddTaskButton(parentNodeName);
        saveToLocalStorage();

        return newTask;
    }

    function saveToLocalStorage() {
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
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
        saveToLocalStorage();
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

    function cancelEdit() {
        document.querySelector('.overlay').remove();
    }

    function acceptEdit() {
        const title = document.querySelector('.edit-title-input').value;
        const date = document.querySelector('.edit-date-input').value;
        const projectTitle = document.querySelector(
            '.edit-project-dropdown'
        ).value;
        const [projectInd, taskInd] = getTaskIndex(this);
        const task = allProjects[projectInd].tasks[taskInd];
        document.querySelector('.overlay').remove();

        task.setTitle(title);
        task.setDueDate(date);

        const newProject = allProjects.find((el) => el.title === projectTitle);
        const oldProject = allProjects[projectInd];

        if (oldProject !== newProject) {
            oldProject.removeTask(taskInd);
            newProject.tasks.push(task);
        }

        const project = document.querySelector(oldProject.elementClassName);
        displayTasks(project, oldProject.tasks);
        createAddTaskButton(project);
        saveToLocalStorage();
    }

    function editTask() {
        const [projectInd, taskInd] = getTaskIndex(this);
        const task = allProjects[projectInd].tasks[taskInd];
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');
        const overlay = createElement('div', ['overlay']);
        const changeBtn = createElement(
            'button',
            ['edit-change-btn'],
            ['textContent', 'type'],
            ['Save', 'button'],
            acceptEdit.bind(this)
        );
        const cancelBtn = createElement(
            'button',
            ['edit-cancel-btn'],
            ['textContent', 'type'],
            ['Cancel', 'button'],
            cancelEdit
        );
        const btnContaniner = createElement('div', ['edit-btn-container']);
        const form = createElement('div', ['edit-form'], ['method'], ['post']);
        const divName = createElement('div', ['edit-title-container']);
        const inputName = createElement(
            'input',
            ['edit-title-input'],
            ['id', 'value'],
            ['taskTitle', task.title]
        );
        const labelName = createElement(
            'label',
            ['edit-title-label'],
            ['for', 'textContent'],
            ['taskTitle', 'Task Title *']
        );
        const divDate = createElement('div', ['edit-date-container']);
        const inputDate = createElement(
            'input',
            ['edit-date-input'],
            ['id', 'value', 'type'],
            ['taskDate', format(new Date(task.dueDate), 'yyyy-MM-dd'), 'date']
        );
        const labelDate = createElement(
            'label',
            ['edit-date-label'],
            ['for', 'textContent'],
            ['taskDate', 'Task Due Date *']
        );
        const divProject = createElement('div', ['edit-project-container']);

        const labelProject = createElement(
            'label',
            ['edit-project-label'],
            ['for', 'textContent'],
            ['taskProject', 'Task Project *']
        );

        const select = createElement(
            'select',
            ['edit-project-dropdown'],
            ['name'],
            ['Projects']
        );

        for (let i = 0; i < allProjects.length; i++) {
            if (i !== Number(projectInd)) {
                const option = createElement(
                    'option',
                    [],
                    ['value', 'textContent'],
                    [allProjects[i].title, allProjects[i].title]
                );
                select.appendChild(option);
            }
        }
        divName.append(labelName, inputName);
        divDate.append(labelDate, inputDate);
        divProject.append(labelProject, select);
        btnContaniner.append(changeBtn, cancelBtn);
        form.append(divName, divDate, divProject, btnContaniner);
        overlay.appendChild(form);
        main.insertBefore(overlay, sidebar);
    }
    // RENDERS ALL TASKS ON INBOX AND PROJECTS PAGES
    function displayTasks(parent, arr) {
        const content = parent;
        removeAllChildNodes(content);

        let projectIndex, taskIndex;
        let curTask;
        if (arr) {
            curTask = arr;
        } else {
            [projectIndex, taskIndex] = getTaskIndex(content);
            curTask = allProjects[projectIndex].tasks;
        }

        curTask.sort((a, b) =>
            compareAsc(new Date(a.dueDate), new Date(b.dueDate))
        );

        for (let i = 0; i < curTask.length; i++) {
            const container = createElement('div', ['task-container']);
            const leftSide = createElement('div', ['container-left']);
            const rightSide = createElement('div', ['container-right']);
            const btn = createElement(
                'button',
                [`task-delete-btn-${i}`, 'task-delete-btn'],
                [],
                [],
                removeTask
            );
            const editBtn = createElement(
                'button',
                [`task-edit-btn-${i}`, 'task-edit-btn'],
                ['textContent'],
                ['Edit'],
                editTask
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
            rightSide.append(editBtn, date);
            container.append(leftSide, rightSide);
            content.appendChild(container);
        }
    }

    return {
        removeAllChildNodes,
        createAddTaskButton,
        createElement,
        displayTasks,
        displayTasksTodayThisWeek,
        storage,
        saveToLocalStorage,
    };
})();

export default UI;
