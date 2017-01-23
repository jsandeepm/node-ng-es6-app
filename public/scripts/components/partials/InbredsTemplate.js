/**
 * Created by SMALA on 7/2/2016.
 */

const inbredsTemplate = `
<div class="col-md-9 col-lg-9">
	<div ng-init="sic.loadCrops()">
	   <h3>Inbred Naming</h3>
	   <hr id="page-heading"/>
         <form role="form" name="searchForm">
            <div class="col-md-2 col-lg-2">
               <div class="form-group">
                  <label>Crop
                  <span>
                  <i class="glyphicon glyphicon-star required-field"></i></span>
                  </label>
                  <br/>
                  <ui-select ng-model="sic.form.crop" reset-search-input="true" theme="select2"
                     style="width: 100%"
                     required="required">
                     <ui-select-match allow-clear="true" placeholder="Crop">{{sic.form.crop}}
                     </ui-select-match>
                     <ui-select-choices repeat="crop in sic.crops | filter: $select.search">
                        <div ng-bind-html="crop | highlight: $select.search"></div>
                     </ui-select-choices>
                  </ui-select>
               </div>
            </div>
            <div class="col-md-9 col-lg-9">
               <div class="form-group">
                  <label for="hybrids">Search<span><i
                     class="glyphicon glyphicon-star  required-field"></i></span></label>
                  <div id="textarea">
                     <input class="form-control" id="hybrids" name="hybrids" size="30"
                        type="text" required="required" ng-model="sic.form.hybrids"
                        placeholder="Pedigree" ng-change="sic.replaceSpacesAndNewLines()"/>
                  </div>
               </div>
            </div>
            <div class="col-md-1 col-lg-1">
               <label class="search-label"></label>
               <div class="form-group">
                  <button type="submit" class="btn btn-default" ng-click="sic.search()"
                     ng-disabled="searchForm.$invalid || sic.form.crop!='CORN'">
                  Generate
                  </button>
               </div>
            </div>
         </form>
	   <div class="clearfix"></div>
	   <div ng-if="sic.pedigreeResultExists">
		  <!-- Nav pill -->
		  <ul class="nav nav-pills">
			 <li class="active"><a href="#needName" aria-controls="needName" data-toggle="pill">Need Name
				<span class="badge">{{sic.searchResult.needNamePedigrees.length}}</span></a>
			 </li>
			 <li><a href="#alreadyNamed" aria-controls="alreadyNamed" data-toggle="pill">Already Named
				<span class="badge">{{sic.searchResult.alreadyNamedPedigrees.length}}</span></a>
			 </li>
			 <li><a href="#errors" aria-controls="errors" data-toggle="pill">Errors
				<span class="badge">{{sic.searchResult.pedigreeErrors.length + sic.searchResult.basePedigreeErrors.length}}</span></a>
			 </li>
		  </ul>
		  <!-- Tab panes -->
		  <div class="tab-content">
			 <div role="tabpanel" class="tab-pane active" id="needName">
				
				<div class="row" ng-if="sic.searchResult.needNamePedigrees.length != 0">
				   <div class="col-lg-8 col-md-8" ng-if="sic.errorTransgenicPedigrees.length>0">
                       <div class="alert alert-danger alert-dismissible transgenic-pedigrees-close" role="alert"> 
                           <button type="button" class="close" data-dismiss="alert" aria-label="Close" ng-click="sic.resetTransgenicPedigreesError()">
                            <span aria-hidden="true">&times;</span>
                           </button> 
                           <strong>Trait Version is mandatory for transgenic pedigrees!<br/></strong> 
                           {{sic.errorTransgenicPedigrees}}
                       </div>
                   </div>
                   
                   <div class="col-lg-8 col-md-8" ng-if="!sic.errorTransgenicPedigrees.length>0"></div>
				   
				   <div class="col-md-3 col-lg-3">
					  <div class="pull-right">
						 <button type="submit" class="btn btn-default" ng-click="sic.selectAll(false)">Deselect All
						 </button>
						 <button type="submit" class="btn btn-default" ng-click="sic.selectAll(true)">Select All
						 </button>
						 <button type="submit" class="btn btn-primary" ng-click="sic.saveInbredDetails()">Save
						 </button>
					  </div>
				   </div>
				</div>
				
				<div class="row" ng-repeat="entry in sic.searchResult.needNamePedigrees">
				   <div class="col-md-11 col-lg-11">
					  <div class="bs-callout bs-callout-default-override">
						 <h4>{{entry.inbredName}}
							<i class="custom-check-box pull-right"
							   ng-class=" entry.checked? 'fa fa-check-circle' : 'fa fa-circle-o'"
							   ng-click="entry.checked = !entry.checked" ng-show="!entry.pedigreeNamed"></i>
						 </h4>
							<table class="table table-borderless table-responsive">
							   <tr>
								  <th>Base Manufacturing Name:</th>
								  <th>Herbicide Code:</th>
								  <th>Trait Code:</th>
								  <th>Commercial Trait:</th>
								  <th>Trait Version:</th>
								  <th>Manufacturing Name:</th>
							   </tr>
							   <tr>
								  <td>{{entry.baseManufacturingCode}}</td>
								  <td>{{entry.herbicideCode}}</td>
								  <td>{{entry.trait}}</td>
								  <td>{{entry.commercialTrait}}</td>
								  <td class="row col-md-2 col-lg-2" ng-include="sic.getTraitVersionNameTemplate(entry, $index)"></td>
								  <td>{{entry.manufacturingCode}}</td>
							   </tr>
							   <tr ng-if="entry.isvalidReciprocal" class="reciprocal-comment">
								  <td colspan="6"><i class="fa fa-info-circle" aria-hidden="true"></i> {{entry.comment}}</td>
							   </tr>
							</table>
					  </div>
				   </div>
				</div>
			 </div>
			 
			 <div role="tabpanel" class="tab-pane" id="alreadyNamed">
				<div class="row" ng-repeat="entry in sic.searchResult.alreadyNamedPedigrees">
				   <div class="col-md-11 col-lg-11">
					  <div class="bs-callout bs-callout-default-override">
						 <h4>{{entry.inbredName}} </h4>
						 <div class="table table-responsive">
							<table class="table table-borderless">
							   <tr>
								  <th>Base Manufacturing Name:</th>
								  <th>Herbicide Code:</th>
								  <th>Trait Code:</th>
								  <th>Commercial Trait:</th>
								  <th>Trait Version:</th>
								  <th>Manufacturing Name:</th>
							   </tr>
							   <tr>
								  <td>{{entry.baseManufacturingCode}}</td>
								  <td>{{entry.herbicideCode}}</td>
								  <td>{{entry.trait}}</td>
								  <td>{{entry.commercialTrait}}</td>
								  <td>{{entry.traitVersion}}</td>
								  <td>{{entry.manufacturingCode}}</td>
							   </tr>
							</table>
						 </div>
					  </div>
				   </div>
				</div>
			 </div>

			 <div role="tabpanel" class="tab-pane" id="errors">

			     <div class="row" ng-if="sic.searchResult.basePedigreeErrors.length != 0">
				   <div class="col-md-11 col-lg-11">
					  <div align="right">
						 <button type="submit" class="btn btn-default" ng-click="sic.selectAllBasePedigrees(false)">Deselect All
						 </button>
						 <button type="submit" class="btn btn-default" ng-click="sic.selectAllBasePedigrees(true)">Select All
						 </button>
						 <button type="submit" class="btn btn-primary" ng-click="sic.fetchConventinalPedigrees()" data-toggle="tooltip" title="Send selected base pedigrees for naming" tooltip-placement="right" tooltip="Send selected base pedigrees for naming">
						    Auto Generate

						 </button>
					  </div>
				   </div>
				</div>

			    <div class="row" ng-repeat="error in sic.searchResult.basePedigreeErrors">
				   <div class="col-md-11 col-lg-11">
					  <div class="bs-callout bs-callout-danger">
						 <h4>{{error.pedigreeName}}
						    <i class="custom-check-box pull-right"
							   ng-class=" error.checked? 'fa fa-check-circle' : 'fa fa-circle-o'"
							   ng-click="error.checked = !error.checked" ></i>
						 </h4>
						 <p>
							{{error.errorDescription}}
						 </p>
					  </div>
				   </div>
				</div>
				<div class="row" ng-repeat="error in sic.searchResult.pedigreeErrors">
				   <div class="col-md-11 col-lg-11">
					  <div class="bs-callout bs-callout-danger">
						 <h4>{{error.pedigreeName}}</h4>
						 <p>
							{{error.errorDescription}}
						 </p>
					  </div>
				   </div>
				</div>
			 </div>

		  </div>
	   </div>
	</div>
 </div>
  <script type="text/ng-template" id="display">
     <div class="col-md-1">
             <i ng-click="sic.editTraitVersionName(entry, $index)" 
             title="Edit Trait Version(Trait version name must be less than or equal to 10 char, contain only Alphanumeric, Hyphen, or plus)" 
             class="fa fa-pencil-square-o"></i>
        </div>
        <div class="col-md-8">
            {{entry.traitVersion || uppercase}}
        </div>
  </script>
  
  <script type="text/ng-template" id="edit">
  <form name="traitEditForm">
     <div class="input-group" ng-class="{ 'has-error' : traitEditForm.traitVersion.$invalid && !traitEditForm.traitVersion.$pristine}">
        <input type="text" class="form-control"  name="traitVersion" id="traitVersion"  placeholder="Trait Version" ng-pattern="/^[a-zA-Z0-9]+[+|-]*[a-zA-Z0-9]*$/"  
        ng-maxlength="10" ng-model="sic.traitVersionEditable.selected.traitVersion" ng-required="entry.isTransgenic">
        <span class="input-group-btn">
            <button type="Submit" ng-disabled="traitEditForm.traitVersion.$invalid || traitEditForm.traitVersion.$pristine" class="btn btn-primary" ng-click="sic.saveTraitVersionName($index)"><i class="glyphicon glyphicon-ok"></i></button>
            <button class="btn btn-default" ng-click="sic.resetTraitVersionName()"><i class="glyphicon glyphicon-remove"></i></button>
        </span>
     </div>
      <div ng-messages="traitEditForm.traitVersion.$error" style="color:maroon" role="alert">
            <div class="alert alert-danger" role="alert" ng-message="maxlength">Trait Version Name should be less than or equal to 10 char</div>
            <div class="alert alert-danger" role="alert" ng-message="pattern">Trait Version Name should Alphanumeric, Hyphen, or plus</div>
            <div class="alert alert-danger" role="alert" ng-message="required">Trait Version Name required for Transgenic</div>
      </div>
      </form>
  </script>
`;
export default inbredsTemplate;