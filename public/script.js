console.log("Hello");

const { axios } = window
const handlebars = window.Handlebars

const output = document.getElementById("recommendations-output")
const button = document.getElementById("submitButton")

const submitForm = async (event) => {
  try {
    event.preventDefault();
    console.log(event);

    disableButton()

    const { elements } = event.target
    const artist1 = elements.artist1.value
    const artist2 = elements.artist2.value
    const artist3 = elements.artist3.value

    console.log(`The artists are ${artist1} ${artist2} ${artist3}`);

    let result;

    try {
      result = await axios.post('/recommendations', { artist1, artist2, artist3 })
      console.log(result)
    }
    catch (err) {
      let errMsg = err.response.data.message ? err.response.data.message : "Something went wrong.."
      return alert(err.message)
    }

    const recommendations = result.data.tracks
    const topFiveRecs = recommendations.slice(0, 5)

    const template = handlebars.compile(templateRaw)

    const html = template({ artist1, artist2, artist3, topFiveRecs })

    output.innerHTML = html
    
  }
  catch (err) {
    console.error(err)
  }
  finally {
    enableButton()
  }
  
};

const enableButton = () => {
  button.disabled = false
  button.value = "Get recommendations"
}
const disableButton = () => {
  button.disabled = true
  button.value = "Loading..."
}

const templateRaw = `
<h2> Top five recommended tracks for you! </h2>
<p> If you love the work of {{artist1}}, {{artist2}} and {{artist3}} </p>
<p> You will really love: </p>
<ol>
    {{#each topFiveRecs}}
    <li> <strong> {{name}} </strong>, By {{artists.[0].name}} - <a href="{{external_urls.spotify}}"> Play Here </a> </li>
    {{/each}}

</ol>`
