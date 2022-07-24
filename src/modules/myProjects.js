import UI from './UI';

(function () {
    const myUI = UI;
    const allProjects = [];

    function displayProjects() {
        const projectContainer = document.querySelector('.project-container');
        createProject();

        for (let i = 0; i < allProjects.length; i++) {
            const container = myUI.createElement(
                'div',
                ['project', `project-${i}`],
                ['innerHTML'],
                [
                    '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3.3 15.4c.717 0 1.3.583 1.3 1.3s-.583 1.3-1.3 1.3-1.3-.583-1.3-1.3.583-1.3 1.3-1.3zm2.7 1.85c0-.414.336-.75.75-.75h14.5c.414 0 .75.336.75.75s-.336.75-.75.75h-14.5c-.414 0-.75-.336-.75-.75zm-2.7-6.55c.717 0 1.3.583 1.3 1.3s-.583 1.3-1.3 1.3-1.3-.583-1.3-1.3.583-1.3 1.3-1.3zm2.7 1.3c0-.414.336-.75.75-.75h14.5c.414 0 .75.336.75.75s-.336.75-.75.75h-14.5c-.414 0-.75-.336-.75-.75zm-2.7-6c.717 0 1.3.583 1.3 1.3s-.583 1.3-1.3 1.3-1.3-.583-1.3-1.3.583-1.3 1.3-1.3zm2.7.75c0-.414.336-.75.75-.75h14.5c.414 0 .75.336.75.75s-.336.75-.75.75h-14.5c-.414 0-.75-.336-.75-.75z" fill-rule="nonzero"/></svg>',
                ]
            );
            const title = myUI.createElement(
                'p',
                ['project-title', `project-title-${i}`],
                ['textContent'],
                [`${allProjects[i]}`]
            );
            const removeProjectBtn = myUI.createElement(
                'button',
                ['remove-project'],
                ['innerHTML'],
                [
                    '<svg class="project-icon" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/></svg>',
                ],
                removeProject
            );
            const containerRight = myUI.createElement('div', [
                'project-container-right',
            ]);

            containerRight.append(title, removeProjectBtn);
            container.appendChild(containerRight);
            projectContainer.appendChild(container);
        }

        removeProjectInputForm();
    }

    function createProject() {
        const title = document.querySelector('.project-inputbox').value;
        allProjects.push(title);
    }

    function removeProjectInputForm() {
        const projectInputForm = document.querySelector('.project-input-form');
        projectInputForm.remove();
        createAddProjectButton();
    }

    function createAddProjectButton() {
        const projectContainer = document.querySelector('.project-container');
        const addBtn = myUI.createElement(
            'button',
            ['add-project'],
            ['innerHTML'],
            ['➕ &nbsp; &nbsp; New Project'],
            displayProjectPopUp
        );

        projectContainer.appendChild(addBtn);
    }

    function removeProject() {
        const project = this.closest('.project');
        const projectIndex = project.className.split('-')[1];
        allProjects.splice(projectIndex);
        project.remove();
    }

    function displayProjectPopUp() {
        const projectContainer = document.querySelector('.project-container');
        const form = myUI.createElement('form', ['project-input-form']);
        const input = myUI.createElement('input', ['project-inputbox']);
        const btnContainer = myUI.createElement('div', [
            'project-btn-container',
        ]);
        const addBtn = myUI.createElement(
            'button',
            ['add-project-btn'],
            ['textContent', 'type'],
            ['Add', 'button'],
            displayProjects
        );
        const cancelBtn = myUI.createElement(
            'button',
            ['cancel-project-btn'],
            ['textContent', 'type'],
            ['Cancel', 'button'],
            removeProjectInputForm
        );

        myUI.removeAllChildNodes(projectContainer);
        btnContainer.append(addBtn, cancelBtn);
        form.append(input, btnContainer);
        projectContainer.appendChild(form);
    }

    createAddProjectButton();

    return { displayProjectPopUp };
})();
