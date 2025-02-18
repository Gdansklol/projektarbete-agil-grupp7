$(document).ready(function() {
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

        filteredHabits.forEach(function(habit, index) {
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

    // Function Spara button
    $('#submitBtn').click(function() {
        const rutin = $('#rutinInput').val();
        const repetitioner = $('#repInput').val();
        const prioritet = $('#prioInput').val();

        if (rutin && repetitioner && prioritet) {
            const habit = { rutin, repetitioner: parseInt(repetitioner), prioritet: parseInt(prioritet) };

            // Uppdatera rutin
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

            // Modal meddelande Success
            $('#modalMessage').text("Rutin sparad!");
            $('#successModal').fadeIn();

            // Rensa Inputs
            $('#rutinInput').val('');
            $('#repInput').val('');
            $('#prioInput').val('');
        }
    });
    
    // Stäng Success Modal
    $('#closeSuccessModal').click(function() {
        $('#successModal').fadeOut();
    });
    
    $('#okButton').click(function() {
        $('#successModal').fadeOut();
    });

    // Stäng button event listener
    $('.close').click(function() {
        $(this).closest('.modal').fadeOut();
    });

    // Edit function
    $(document).on('click', '.editBtn', function() {
        const rowIndex = $(this).closest('tr').data('index');
        const habit = habits[rowIndex];

        $('#rutinInput').val(habit.rutin);
        $('#repInput').val(habit.repetitioner);
        $('#prioInput').val(habit.prioritet);

        $('#submitBtn').data('edit', true).data('index', rowIndex);
    });

    // Radera function. Modal.
    $(document).on('click', '.deleteBtn', function() {
        const rowIndex = $(this).closest('tr').data('index');
        $('#confirmDeleteBtn').data('index', rowIndex);
        $('#deleteModal').fadeIn();
    });

    // OK button, radera. Modal.
    $('#confirmDeleteBtn').click(function() {
        const index = $(this).data('index');
        habits.splice(index, 1);
        saveHabitsToStorage(habits);
        filteredHabits = habits;
        renderTable();
        $('#deleteModal').fadeOut();
    });

    // Ångra radera. Modal.
    $('#cancelDeleteBtn').click(function() {
        $('#deleteModal').fadeOut();
    });

    // Tomma <th> element disable
    $('th').each(function() {
        if ($(this).text().trim() === "") {
            $(this).css("pointer-events", "none");
            $(this).css("color", "gray");
        }
    });

    // Sortera kolumner
    $('th').on('click', function() {
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

    // Filtering radio buttons
    $('input[name="radio"]').on('change', function() {
        const selectedPriority = $('input[name="radio"]:checked').val();

        if (selectedPriority === "") {
            filteredHabits = habits;
        } else {
            filteredHabits = habits.filter(habit => habit.prioritet === parseInt(selectedPriority));
        }

        renderTable();
    });

    // Render start
    renderTable();
});
