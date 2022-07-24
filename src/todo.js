export { Task, Project };

import { format } from 'date-fns';

function Task(title, dueDate, parent) {
    function setTitle(title) {
        this.title = title;
    }
    function setDueDate(dueDate) {
        this.dueDate = dueDate;
    }
    function setParent(parent) {
        this.parent = parent;
    }

    dueDate = format(new Date(dueDate), 'E-dd-MMM-yyyy');
    return { title, dueDate, setTitle, setDueDate, parent };
}

function Project(title, tasks) {
    function removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
    }

    return {
        title,
        tasks,
        removeTask,
    };
}
