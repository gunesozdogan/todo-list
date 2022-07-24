export default Task;

import { format } from 'date-fns';

function Task(title, dueDate) {
    function setTitle(title) {
        this.title = title;
    }
    function setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    dueDate = format(new Date(dueDate), 'E-dd-MMM-yyyy');
    return { title, dueDate, setTitle, setDueDate };
}
