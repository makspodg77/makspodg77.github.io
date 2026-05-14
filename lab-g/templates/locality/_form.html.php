<?php
    /** @var $locality ?\App\Model\Locality */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="locality[name]" value="<?= $locality ? $locality->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="municipality">Municipality</label>
    <textarea id="municipality" name="locality[municipality]"><?= $locality? $locality->getMunicipality() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="county">County</label>
    <textarea id="county" name="locality[county]"><?= $locality? $locality->getCounty() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
