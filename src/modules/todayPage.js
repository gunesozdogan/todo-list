export default loadTodayPage;

import UI from './UI';
import { getTasks } from '../todo';
import { format } from 'date-fns/esm';

const today = document.querySelector('.today');
today.addEventListener('click', loadTodayPage);

function loadTodayPage() {
    // CLEARS ALL THE CONTENT OF MAIN CONTENT
    const myUI = UI;
    const mainContent = document.querySelector('.main-content');
    myUI.removeAllChildNodes(mainContent);

    // LOADS TODAY PAGE
    const content = myUI.createElement(...['div', ['content-today']]);
    const h2 = myUI.createElement(...['h2', , ['textContent'], ['Today']]);

    myUI.displayTasksTodayThisWeek('today', content);
    mainContent.append(h2, content);
}
