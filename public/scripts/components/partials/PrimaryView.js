import InbredsTemplate from './InbredsTemplate';
import TraitCodeTemplate from './TraitCodeTemplate';

const PrimaryView = `
<div class="container-fluid">
   <ul class="nav nav-tabs">
      <li class="active"><a href="#inbredSearchTab" aria-controls="inbredSearchTab" data-toggle="tab">Inbred Naming</a></li>
      <li><a href="#TraitCodeGenTab" aria-controls="TraitCodeGenTab" data-toggle="tab">Generate Trait Code</a></li>
   </ul>
   <!-- Tab panes -->
   <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="inbredSearchTab">
      `
    + InbredsTemplate +
    `</div>
      <div role="tabpanel" class="tab-pane" id="TraitCodeGenTab">
       `
    + TraitCodeTemplate +
    `
       </div>
   </div>
</div>`;

export default PrimaryView;