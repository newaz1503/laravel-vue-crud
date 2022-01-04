<template>
    <div class="customer">
        <div class="row justify-content-center">
<!--            <vue-progress-bar></vue-progress-bar>-->
            <vue-snotify></vue-snotify>
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <strong>All Customer</strong>
                        <button class="btn btn-info btn-sm text-white" style="position: absolute; right: 7rem; top: 0.25rem" @click="showModal()">Add Customer <i class="fas fa-plus"></i></button>
                        <button class="btn btn-primary btn-sm" style="position: absolute; right: 1rem; top: 0.25rem" @click="freshData()">Refresh <i class="fas fa-sync"></i></button>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <div class="row">
                                <div class="col-md-2">
                                    <p><strong>Search By</strong></p>
                                </div>
                                <div class="col-md-3">
                                    <select v-model="queryField" class="form-control">
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="address">Address</option>
                                        <option value="total">Total</option>
                                    </select>
                                </div>
                                <div class="col-md-7">
                                    <input type="text" v-model="query" class="form-control" placeholder="Search">
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>Serial</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-show="customers.length" v-for="(customer, index) in customers" :key="customer.id">
                                    <th>{{index + 1}}</th>
                                    <td>{{customer.name}}</td>
                                    <td>{{customer.email}}</td>
                                    <td>{{customer.phone}}</td>
                                    <td>{{customer.total}}</td>
                                    <td>
                                        <button class="btn btn-info btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-primary btn-sm mx-1" @click="edit(customer)">
                                            <i class="fas fa-pencil"></i>
                                        </button>
                                        <button class="btn btn-danger btn-sm" @click="destroy(customer)">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-show="!customers.length">
                                    <td colspan="6" class="bg-danger text-white p-2">
                                        Data Not Found
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                            <pagination-component v-if="pagination.last_page > 1"
                                :pagination="pagination"
                                :offset="5"
                                @paginate="query == '' ? allData(): searchData()"

                                ></pagination-component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- create modal-->
        <!-- Modal -->
        <div class="modal fade" id="customerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">{{editMode ? 'Edit' : 'Add New'}} Customer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="editMode ? update() : store()" @keydown="form.onKeydown($event)">
                        <div class="modal-body">
                            <input v-model="form.name" type="text" name="name" placeholder="Name" class="form-control mb-3">
                            <div v-if="form.errors.has('name')" v-html="form.errors.get('name')" style="color:red"/>

                            <input v-model="form.email" type="email" name="email" placeholder="Email" class="form-control mb-3">
                            <div v-if="form.errors.has('email')" v-html="form.errors.get('email')" style="color:red"/>

                            <input v-model="form.phone" type="tel" name="phone" placeholder="Phone" class="form-control mb-3">
                            <div v-if="form.errors.has('phone')" v-html="form.errors.get('phone')" style="color:red"/>

                            <textarea v-model="form.address" name="address"  rows="5" class="form-control mb-3" placeholder="Address"></textarea>
                            <div v-if="form.errors.has('address')" v-html="form.errors.get('address')" style="color:red"/>

                            <input v-model="form.total" type="number" name="total" placeholder="Total" class="form-control">
                            <div v-if="form.errors.has('total')" v-html="form.errors.get('total')" style="color:red"/>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" :disabled="form.busy" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Customer",
        data(){
            return{
                editMode: false,
                form: new Form({
                   id: '',
                   name: '',
                   email: '',
                   phone: '',
                   address: '',
                   total: '',
                }),
                queryField: 'name',
                query:'',
                customers: [],
                pagination:{
                    current_page: 1
                },

            }
        },
        watch: {
            query: function (newQ, oldQ) {
                if (newQ === ''){
                    this.allData();
                }else{
                    this.searchData();
                }
            }
        },
        methods:{
            allData(){
                // this.$Progress.start();
                axios.get('/api/customer?page='+this.pagination.current_page)
                    .then(res => {
                        this.customers = res.data.data;
                        this.pagination = res.data.meta;
                        // this.$Progress.finish();
                    })
                    .catch( error => {
                        console.log(error);
                        // this.$Progress.fail();
                    })
            },
            searchData(){
                axios.get('/api/search/customer/'+this.queryField+'/'+this.query+'?page=' + this.pagination.current_page)
                    .then(res => {
                        this.customers = res.data.data;
                        this.pagination = res.data.meta;
                    })
                    .catch(error =>{
                        console.log(error)
                    })
            },
            freshData(){
                this.allData();
                this.customers = '';
                this.query = '';
                this.queryField = 'name';
                this.$snotify.success('Refreshed Successfully',' Success');
            },
            showModal(){
                this.editMode = false;
                this.form.clear();
                this.form.reset();
                $('#customerModal').modal('show');
            },
            store(){
                this.form.busy = true;
                this.form.post('/api/customer')
                    .then(res =>{
                        this.allData();
                        $('#customerModal').modal('hide');
                        if (this.form.successful){
                            this.$snotify.success('Customer Added Successfully',' Success');
                        }else{
                            this.$snotify.error('Something went wrong',' Error');
                        }
                    })
                    .catch( error =>{
                        console.log(error)
                    })
            },
            edit(customer){
                this.editMode = true;
                this.form.clear();
                this.form.reset();
                this.form.fill(customer);
                $('#customerModal').modal('show');
            },
            update(){
                this.form.busy = true;
                this.form.put('/api/customer/'+this.form.id)
                    .then(res =>{
                        this.allData();
                        $('#customerModal').modal('hide');
                        if (this.form.successful){
                            this.$snotify.success('Customer Updated Successfully',' Success');
                        }else{
                            this.$snotify.error('Something went wrong',' Error');
                        }
                    })
                    .catch( error =>{
                        console.log(error)
                    })
            },
            destroy(customer) {
                this.$snotify.clear();
                this.$snotify.confirm(
                    "You will not be able to recover this data!",
                    "Are you sure?",
                    {
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        buttons: [
                            {
                                text: "Yes",
                                action: toast => {
                                    this.$snotify.remove(toast.id);
                                    axios.delete("/api/customer/" + customer.id)
                                        .then(response => {
                                            this.allData();
                                            this.$snotify.success(
                                                "Customer Successfully Deleted",
                                                "Success"
                                            );
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                },
                                bold: true
                            },
                            {
                                text: "No",
                                action: toast => {
                                    this.$snotify.remove(toast.id);
                                },
                                bold: true
                            }
                        ]
                    }
                );
            }
        },
        mounted(){
            this.allData();
        },
    }
</script>

<style scoped>

</style>
