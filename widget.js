import texts from "./texts.js"

try {
    let inited = false
    let backendBase = 'http://localhost:8080'
    let resLink = 'http://localhost:3000?establishment=$$$id&lng=$$lng'
    let opened = false

    const getUserLang = () => {
        try {
            const rawLang = navigator.languages?.[0]
                || navigator.language
                || 'en';
            
            return rawLang.split('-')[0].toLowerCase();
        } catch {
            return 'en';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        init()
    })

    const init = () => {
        console.log("init start")
        inited = true
        const btn = document.getElementById('yummeezy-res-btn')
        const iframeContainer = document.getElementById('yummeezy-iframe')
        const iframe = iframeContainer.querySelector('iframe')
        const chevron = document.getElementById('yummeezy-btn-chevron')
        const text = document.getElementById('yummeezy-res-text')

        // Get widget colors
        const id = document.body.getAttribute('data-establishment-id')
        console.log("id:", id)

        fetch(`${ backendBase }/api/no-auth`, { method: 'POST', body: JSON.stringify({ data: id, action: "get-widget-colors" })})
        .then(async(res) => {
            const json = await res.json()
            const colors = json.data

            btn.style.background = colors.bg
            btn.style.color = colors.text
            btn.style.borderColor = colors.text
        })

        // Set Iframe & btn text
        let lng = getUserLang()
        resLink = resLink.replace('$$$id', id)
        resLink = resLink.replace('$$$lng', lng)
        iframe.setAttribute('src', resLink)
        text.textContent = texts.reserve[ lng ]

        // Interactions
        btn.addEventListener('click', () => {
            let height = '0px'
            let transform = 'rotate(0deg)'
            if (!opened) {
                height = Math.max(350, Math.min(550, window.innerHeight - 150)) + 'px'
                transform = 'rotate(180deg)'
                opened = true
            } else {
                opened = false
            }

            iframeContainer.animate([{ height }], { duration: 618, easing: "ease-in-out" })
            .onfinish = () => {
                iframeContainer.style.height = height
            }

            chevron.animate([{ transform }], { duration: 200, easing: "ease-in-out" })
            .onfinish = () => {
                chevron.style.transform = transform
            }
        })
    }

    // Fallback if DOMContentLoaded is not triggered
    setTimeout(() => {
        if (!inited) {
            init()
        }
    }, 2000)
} catch (error) {
    console.log(error.message)
}