import loadInboxPage from './modules/inboxPage';
import loadTodayPage from './modules/todayPage';
import loadThisWeekPage from './modules/thisWeekPage';
import displayProjectPopUp from './modules/myProjects';
import { format, isBefore, isAfter } from 'date-fns';
import UI from './modules/UI';

export { Task, Project, getTasks };

const allProjects = [Project('Inbox', [], '.content-inbox')];

function Task(title, dueDate, parent) {
    function setTitle(title) {
        this.title = title;
    }
    function setDueDate(dueDate) {
        this.dueDate = format(new Date(dueDate), 'E-dd-MMM-yyyy');
    }
    function setParent(parent) {
        this.parent = parent;
    }

    dueDate = format(new Date(dueDate), 'E-dd-MMM-yyyy');
    return { title, dueDate, parent, setTitle, setDueDate, setParent };
}

function Project(title, tasks, elementClassName) {
    function removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
    }
    return {
        title,
        tasks,
        removeTask,
        elementClassName,
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
