document.addEventListener("DOMContentLoaded", function () {

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");


    if (!themeToggle) {

        return;

    }


    // ==========================================
    // CARGAR TEMA GUARDADO
    // ==========================================

    const temaGuardado =
        localStorage.getItem("theme");


    if (temaGuardado === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        actualizarBotonTema(true);

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        actualizarBotonTema(false);

    }


    // ==========================================
    // CAMBIAR TEMA
    // ==========================================

    themeToggle.addEventListener(
        "click",
        function () {

            const modoOscuro =
                document.body.classList.toggle(
                    "dark-mode"
                );


            localStorage.setItem(
                "theme",
                modoOscuro
                    ? "dark"
                    : "light"
            );


            actualizarBotonTema(
                modoOscuro
            );

        }
    );


    function actualizarBotonTema(esOscuro) {

        if (themeIcon) {

            themeIcon.textContent =
                esOscuro ? "☀️" : "🌙";

        }


        if (themeText) {

            themeText.textContent =
                esOscuro
                    ? "Modo claro"
                    : "Modo oscuro";

        }

    }

});