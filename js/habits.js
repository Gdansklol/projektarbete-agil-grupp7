$(document).ready(function() {
    //Prio map
    const priorityMapping = {
        1: { swedish: 'Låg', english: 'Low' },
        2: { swedish: 'Mellan', english: 'Medium' },
        3: { swedish: 'Hög', english: 'High' }
    };
    
    // Hämta inloggad användare
    const currentUser = sessionStorage.getItem('currentUser');

    if (!currentUser) {
        window.location.href = "./pages/login.html";
    }

    // ladda habits för aktuell användare
    function getHabitsFromStorage() {
        const habitsData = localStorage.getItem(`${currentUser}_habits`);
        return habitsData ? JSON.parse(habitsData) : [];
    }

    // Spara habits till localStorage för aktuell användare
    function saveHabitsToStorage(habits) {
        localStorage.setItem(`${currentUser}_habits`, JSON.stringify(habits));
    }

    let habits = getHabitsFromStorage();
    let filteredHabits = habits;

    // Render table
    function renderTable() {
        $('#myTable').empty()

        filteredHabits.forEach(function(habit, index) {
            const priorityEnglish = priorityMapping[habit.prioritet].english;


            const row = `<tr data-index="${index}">
                <td>${habit.rutin}</td>
                <td>${habit.repetitioner}</td>
                <td class="prio-${habit.prioritet}">${priorityEnglish}</td>
                <td><button class="editBtn"><i class="fas fa-pen-to-square"></i></button></td>
                <td><button class="deleteBtn"><i class="fas fa-trash"></i></button></td>
            </tr>`;

            $('#myTable').append(row);
        });
    }

    $('#submitBtn').click(function() {
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
            $('#modalMessage').text("Routine saved!");
            $('#successModal').fadeIn();
    
            $('#rutinInput').val('');
            $('#repInput').val('');
            $('#prioInput').val('');
        } else {
            $('#emptyInputsModal').css('display', 'flex');
        }
    });
    
    // Stäng empty input. Modal
    $('#okButtonEmpty').click(function() {
        $('#emptyInputsModal').css('display', 'none');
    });
    
    // Stäng Success Modal
    $('#closeSuccessModal').click(function() {
        $('#successModal').fadeOut();
    });
    
    $('#okButton').click(function() {
        $('#successModal').fadeOut();
    });

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

    // Filter radio buttons
    $('input[name="radio"]').on('change', function() {
        const selectedPriority = $('input[name="radio"]:checked').val();

        if (selectedPriority === "") {
            filteredHabits = habits;
        } else {
            filteredHabits = habits.filter(habit => habit.prioritet === parseInt(selectedPriority));
        }

        renderTable();
    });


    // Logga ut
    document.querySelector('#logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        
        window.location.href = './login.html';
    });

    // Initial render, table
    renderTable();
});