class Character {
    #id
    #name
    #height
    #mass

    constructor(id, name, height, mass) {
        this.#id = id;  // Private property to store the character's ID
        this.#name = name;
        this.#height = height;
        this.#mass = mass;
    }

    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }

    get height() {
        return this.#height;
    }

    get mass() {
        return this.#mass;
    }

    set name(value) {
        this.#name = value.toUpperCase();
    }
}

async function fetchCharacterData(id){
    try{
        const response=await fetch (`https://swapi.dev/api/people/${id}/`)
        if(!response.ok) throw new Error ('Error al taer al personaje de Star Wars ${id}')
            const data = await response.json();
 
        return new Character(data.id, data.name, data.height, data.mass);
    }catch (error){
        console.error (error)
    }
}

async function* fetchCharactersGenerator(rangeStart, rangeEnd) {
    try {
    for (let id = rangeStart; id <= rangeEnd; id++) {  //tambien puede ser un while loop
        const character = await fetchCharacterData(id);
        yield character;
    }} catch (error) {
        console.error(error);
   
}
}

async function displayCharacter(containerId, characterGenerator) {
    const container = document.getElementById(containerId);
    try {
        const character = await characterGenerator.next();
        if (!character.done) {
            const cardHTML = createCharacterCard(character.value);
            container.innerHTML += cardHTML;
        }
    } catch (error) {
        console.error(error);
        container.innerHTML += `<p>Error loading character data.</p>`;
    }
}

function createCharacterCard(character) {
    return `
        <div class="single-timeline-content">
            <div class="timeline-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="timeline-text">
                <h6>${character.name}</h6>
                <p>Estatura: ${character.height} cm</p>
                <p>Peso: ${character.mass} kg</p>
            </div>
        </div>
    `;
}

document.querySelectorAll('.timeline-item').forEach(item => {
    const [start, end] = item.getAttribute('data-range').split('-').map(Number);
    const containerId = `range-${start}-${end}`;
    const characterGenerator = fetchCharactersGenerator(start, end);

    item.addEventListener('click', async () => {
        const { value: character, done } = await characterGenerator.next();

        if (done) {
            alert('No hay más personajes en este rango de búsqueda.');
            return; // Salir si no hay más personajes
        }

        const cardHTML = createCharacterCard(character);
        const container = document.getElementById(containerId);
        container.innerHTML += cardHTML; // Agrega la tarjeta al contenedor
    });
});


