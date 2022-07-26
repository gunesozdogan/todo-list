export default loadThisWeekPage;

import UI from './UI';

const thisWeek = document.querySelector('.this-week');
thisWeek.addEventListener('click', loadThisWeekPage);

function loadThisWeekPage() {
    // CLEARS ALL THE CONTENT OF MAIN CONTENT
    const myUI = UI;
    const mainContent = document.querySelector('.main-content');
    myUI.removeAllChildNodes(mainContent);

    // LOADS THIS WEEKS PAGE
    const h2 = myUI.createElement(...['h2', , ['textContent'], ['This Week']]);
    const content = myUI.createElement(...['div', ['content-thisWeek']]);

    myUI.displayTasksTodayThisWeek('thisWeek', content);
    mainContent.append(h2, content);
}
