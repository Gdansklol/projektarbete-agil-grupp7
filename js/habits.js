<<<<<<< HEAD:js/habits.js
$(document).ready(function () {
=======
$(document).ready(function() {
    //Prio map
>>>>>>> feature/habits:habits.js
    const priorityMapping = {
        1: 'Låg',
        2: 'Mellan',
        3: 'Hög'
    };

    // ladda localStorage
    function getHabitsFromStorage() {
        const habitsData = localStorage.getItem('habits');
        return habitsData ? JSON.parse(habitsData) : [];
    }

    // Spara till localStorage
    function saveHabitsToStorage(habits) {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    let habits = getHabitsFromStorage();
    let filteredHabits = habits;

    // Render table
    function renderTable() {
        $('#myTable').empty()

        filteredHabits.forEach(function (habit, index) {
            const priorityName = priorityMapping[habit.prioritet];

            const row = `<tr data-index="${index}">
                <td>${habit.rutin}</td>
                <td>${habit.repetitioner}</td>
                <td class="prio-${habit.prioritet}">${priorityName}</td>
                <td><button class="editBtn">Ändra</button></td>
                <td><button class="deleteBtn">Ta bort</button></td>
            </tr>`;

            $('#myTable').append(row);
        });
    }

<<<<<<< HEAD:js/habits.js
    // Function Spara button
    $('#submitBtn').click(function () {
=======
    $('#submitBtn').click(function() {
>>>>>>> feature/habits:habits.js
        const rutin = $('#rutinInput').val();
        const repetitioner = $('#repInput').val();
        const prioritet = $('#prioInput').val();
    
        if (rutin && repetitioner && prioritet) {
            const habit = { rutin, repetitioner: parseInt(repetitioner), prioritet: parseInt(prioritet) };
    
            // Ändra rutin
            if ($('#submitBtn').data('edit')) {
                const index = $('#submitBtn').data('index');
                habits[index] = habit;
                $('#submitBtn').removeData('edit').removeData('index');
            } else {
                habits.push(habit);
            }
    
            saveHabitsToStorage(habits);
            filteredHabits = habits;
            renderTable();
    
            // Success Modal
            $('#modalMessage').text("Rutin sparad!");
            $('#successModal').fadeIn();
    
            $('#rutinInput').val('');
            $('#repInput').val('');
            $('#prioInput').val('');
        } else {
 
            $('#emptyInputsModal').css('display', 'flex');
        }
    });
<<<<<<< HEAD:js/habits.js

    // Alert Fyll i inputs. Modal.


=======
    
    // Stäng empty input. Modal
    $('#okButtonEmpty').click(function() {
        $('#emptyInputsModal').css('display', 'none');
    });
    
>>>>>>> feature/habits:habits.js
    // Stäng Success Modal
    $('#closeSuccessModal').click(function () {
        $('#successModal').fadeOut();
    });

    $('#okButton').click(function () {
        $('#successModal').fadeOut();
    });

<<<<<<< HEAD:js/habits.js
    // Stäng button event listener
    $('.close').click(function () {
=======
    $('.close').click(function() {
>>>>>>> feature/habits:habits.js
        $(this).closest('.modal').fadeOut();
    });

    // Edit function
    $(document).on('click', '.editBtn', function () {
        const rowIndex = $(this).closest('tr').data('index');
        const habit = habits[rowIndex];

        $('#rutinInput').val(habit.rutin);
        $('#repInput').val(habit.repetitioner);
        $('#prioInput').val(habit.prioritet);

        $('#submitBtn').data('edit', true).data('index', rowIndex);
    });

    // Radera function. Modal.
    $(document).on('click', '.deleteBtn', function () {
        const rowIndex = $(this).closest('tr').data('index');
        $('#confirmDeleteBtn').data('index', rowIndex);
        $('#deleteModal').fadeIn();
    });

    // OK button, radera. Modal.
    $('#confirmDeleteBtn').click(function () {
        const index = $(this).data('index');
        habits.splice(index, 1);
        saveHabitsToStorage(habits);
        filteredHabits = habits;
        renderTable();
        $('#deleteModal').fadeOut();
    });

    // Ångra radera. Modal.
    $('#cancelDeleteBtn').click(function () {
        $('#deleteModal').fadeOut();
    });

    // Tomma <th> element disable
    $('th').each(function () {
        if ($(this).text().trim() === "") {
            $(this).css("pointer-events", "none");
            $(this).css("color", "gray");
        }
    });

    // Sortera kolumner
    $('th').on('click', function () {
        let column = $(this).data('column');
        let order = $(this).data('order');
        let text = $(this).html();
        text = text.substring(0, text.length - 1);

        // Toggle sortera
        if (order === 'desc') {
            $(this).data('order', "asc");

            filteredHabits = filteredHabits.sort((a, b) => {
                if (column === "repetitioner") {
                    return a[column] - b[column];
                } else {
                    return a[column] > b[column] ? 1 : -1;
                }
            });

            text += '&#9660';
        } else {
            $(this).data('order', "desc");

            filteredHabits = filteredHabits.sort((a, b) => {
                if (column === "repetitioner") {
                    return b[column] - a[column];
                } else {
                    return a[column] < b[column] ? 1 : -1;
                }
            });

            text += '&#9650';
        }

        $(this).html(text);
        renderTable();
    });

<<<<<<< HEAD:js/habits.js
    // Filtering radio buttons
    $('input[name="radio"]').on('change', function () {
=======
    // Filter radio buttons
    $('input[name="radio"]').on('change', function() {
>>>>>>> feature/habits:habits.js
        const selectedPriority = $('input[name="radio"]:checked').val();

        if (selectedPriority === "") {
            filteredHabits = habits;
        } else {
            filteredHabits = habits.filter(habit => habit.prioritet === parseInt(selectedPriority));
        }

        renderTable();
    });

    renderTable();
});
