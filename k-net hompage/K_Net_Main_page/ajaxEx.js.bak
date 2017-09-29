        window.onpopstate = popState;
        var state = { currneturl : "main.html #Intructions" };
        $(document).ready(function () {
            $("#Show1").click(function () {
                history.pushState(state,"","");
                $("#Intructions").load("main.html #Intructions");
            });
            $("#Show2").click(function () {
                history.pushState(state, "", "");
                $("#Intructions").load("HtmlSamplePage.html");
            });
            $("#Show3").click(function () {
                history.pushState(state, "", "");
                $("#Intructions").load("HtmlSamplePage.html");
            });
            $("#Show4").click(function () {
                history.pushState(state, "", "");
                $("#Intructions").load("HtmlSamplePage.html");
            });
            $("#Show5").click(function () {
                history.pushState(state, "", "");
                $("#Intructions").load("HtmlSamplePage.html");
            });
            $("#Show6").click(function () {
                history.pushState(state, "", "");
                $("#Intructions").load("HtmlSamplePage.html");
            });
        });

        function popState(event) {
            if(event.state)
            {
                state = event.state;
                $("#Intructions").load(state.currneturl);
            }
        }