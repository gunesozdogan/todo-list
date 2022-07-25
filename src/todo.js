export { Task, Project, getTasks };

import { format, compareAsc, isBefore, isAfter } from 'date-fns';
import { UI } from './modules/UI';
import { da, is } from 'date-fns/locale';

const allProjects = [Project('Inbox', [])];
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
    return { title, dueDate, parent, setTitle, setDueDate, setParent };
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

function getTasks(time1, time2) {
    const myObject = {};

    for (let projectInd = 0; projectInd < allProjects.length; projectInd++) {
        const myArray = [];

        for (
            let taskInd = 0;
            taskInd < allProjects[projectInd].tasks.length;
            taskInd++
        ) {
            const dueDate = new Date(
                allProjects[projectInd].tasks[taskInd].dueDate
            ).setHours(10, 10, 10, 10);

            if (isBefore(time1, dueDate) && isAfter(time2, dueDate)) {
                myArray.push(allProjects[projectInd].tasks[taskInd]);
            }
        }

        myObject[allProjects[projectInd].title] = myArray;
    }
    return myObject;
}

export { allProjects };
