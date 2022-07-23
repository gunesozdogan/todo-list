export default Task;

import allTasks from './modules/UI';
import { format } from 'date-fns';

function Task(title, dueDate) {
    function setTitle(title) {
        this.title = title;
    }
    dueDate = format(new Date(dueDate), 'E-dd-MMM-yyyy');

    return { title, dueDate, setTitle };
}
