document.addEventListener('DOMContentLoaded', function() {
    fetch('/random-images')
        .then(response => response.json())
        .then(imageIDs => {
            const surveyContainer = document.querySelector('#survey-form');
            imageIDs.forEach((imageID, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                
                const img = document.createElement('img');
                img.src = `images/${imageID}.jpg`;
                img.alt = `Image ${index + 1}`;
                
                const p = document.createElement('p');
                p.textContent = `Question ${index + 1}: What is in this image?`;
                
                questionDiv.appendChild(img);
                questionDiv.appendChild(p);
                
                ['Monitor', 'Keyboard', 'Mouse', 'Computer'].forEach(cls => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = `question${index + 1}`;
                    checkbox.value = cls;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${cls}`));
                    questionDiv.appendChild(label);
                });
                
                surveyContainer.appendChild(questionDiv);
            });

            // Add submit button
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            surveyContainer.appendChild(submitButton);
        })
        .catch(error => console.error('Error fetching images:', error));
});