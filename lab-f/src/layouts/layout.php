<!DOCTYPE html>
<html lang="en">
<head>
    <title><?= htmlspecialchars($title) ?></title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
   <main>
       <div class="container">
           <form method="POST">

               <fieldset>
                   <legend>Select from type</legend>
                   <?php foreach ($encoders as $format => $encoder): ?>
                       <input type="radio" name="from" value="<?= $format ?>" id="from-<?= $format ?>"
                           <?= $from === $format ? 'checked' : '' ?>>
                       <label for="from-<?= $format ?>"><?= strtoupper($format) ?></label>
                   <?php endforeach ?>
               </fieldset>

               <textarea name="input" id="input" cols="30" rows="10" placeholder="Paste the data here"><?= htmlspecialchars($input) ?></textarea>

               <div class="buttons">
                   <button type="button" id="swap"></button>
                   <button type="submit" id="encode">Encode</button>
               </div>

               <script>
                   document.getElementById('swap').addEventListener('click', () => {
                       const fromVal = document.querySelector('input[name="from"]:checked')?.value;
                       const toVal   = document.querySelector('input[name="to"]:checked')?.value;
                       const input = document.getElementById('input');
                       const result = document.getElementById('result');

                       if (fromVal && toVal && input.value && result.value) {
                           document.querySelector(`input[name="from"][value="${toVal}"]`).checked = true;
                           document.querySelector(`input[name="to"][value="${fromVal}"]`).checked = true;
                           const temp = input.value;
                           input.value = result.value;
                           result.value = temp;
                       }
                   });
               </script>

               <fieldset>
                   <legend>Select to type</legend>
               <?php foreach ($encoders as $format => $encoder): ?>
                   <input type="radio" name="to" value="<?= $format ?>" id="to-<?= $format ?>"
                       <?= $to === $format ? 'checked' : '' ?>>
                   <label for="to-<?= $format ?>"><?= strtoupper($format) ?></label>
               <?php endforeach ?>
               </fieldset>

               <textarea name="result" id="result" cols="30" rows="10" readonly><?= htmlspecialchars($result ?? '') ?></textarea>           </form>
       </div>
   </main>
</body>
</html>