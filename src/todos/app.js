import todoStore, { Filters } from '../store/todo.store'
import html from './app.html?raw'
import { renderPending, renderTodos } from './use-cases';

const ELementsIds = {
    ClearCompleted    : '.clear-completed',
    NewTodoInput      : '#new-todo-input',
    TodoList          : '.todo-list',
    TodoFilters       : '.filtro',
    PendingCountLabel : '#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */

export const  App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ELementsIds.TodoList, todos );
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending( ELementsIds.PendingCountLabel );
    }
    
    // Se ejecuta cuando se llama la función App()
    (() => {
        const app = document.createElement('div');
        app.innerHTML  = html;
        document.querySelector( elementId ).append( app );
        displayTodos();
    })()

    //Referencia HTML
    const newDescriptionInput = document.querySelector( ELementsIds.NewTodoInput );
    const todoListUl = document.querySelector( ELementsIds.TodoList );
    const clearCompletedBtn = document.querySelector( ELementsIds.ClearCompleted );
    const filterList = document.querySelectorAll( ELementsIds.TodoFilters );

    //Listeners
    newDescriptionInput.addEventListener( 'keyup', ( event ) => {
        if ( event.keyCode !== 13 ) return;
        if ( event.target.value.trim().length === 0 ) return

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = '';
    });

    todoListUl.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo( element.getAttribute('data-id') );
        displayTodos()
    });

    todoListUl.addEventListener('click', (event) => {
        const isDestroy = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if ( !element || !isDestroy ) return;
        todoStore.deleteTodo( element.getAttribute('data-id') );
        displayTodos()
    });

    clearCompletedBtn.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos()
    });

    filterList.forEach( element => {
        element.addEventListener('click', (element) => {
            filterList.forEach( el => { el.classList.remove('selected')});
            element.target.classList.add('selected');

            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.all)
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;
            }
            displayTodos();
        });
    });
}